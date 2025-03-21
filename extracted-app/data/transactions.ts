/**
 * Transactions data service
 */

import { Transaction, Pagination, Sorting, SortingOrder } from '../types'
import { apiService } from '../services'
import { logger } from '../services/logger'

/**
 * Filters for transactions
 */
export interface TransactionFilters {
  isActive?: boolean
  search?: string
}

/**
 * Transactions data
 */
let transactions: Transaction[] = []
let loading = false

/**
 * Fetch transactions from the API
 * @returns Promise resolving with transactions
 */
export const fetchTransactions = async (): Promise<Transaction[]> => {
  loading = true
  const transactionsTemp: Transaction[] = []
  let nextLink: string | null = '/data-api/rest/Transaction'
  
  try {
    while (nextLink) {
      logger.debug('Fetching next link:', nextLink)
      
      const response = await apiService.request(nextLink, {
        method: 'GET',
        timeout: 10000, // 10 second timeout
      })
      
      if (response.nextLink) {
        const url = new URL(response.nextLink)
        nextLink = url.pathname + url.search
        if (!nextLink.startsWith('/data-api')) {
          nextLink = '/data-api' + nextLink
        }
      } else {
        nextLink = null
      }
      
      transactionsTemp.push(...response.value)
    }
    
    // Update transactions
    transactions = transactionsTemp
    
    // Store in localStorage for offline access
    try {
      localStorage.setItem('cached_transactions', JSON.stringify(transactionsTemp))
      localStorage.setItem('transactions_cache_time', Date.now().toString())
    } catch (e) {
      logger.warn('Failed to cache transactions in localStorage:', e)
    }
    
    return transactions
  } catch (error) {
    logger.error('Error fetching transactions:', error)
    
    // Try to load from cache
    try {
      const cachedData = localStorage.getItem('cached_transactions')
      if (cachedData) {
        const parsedData = JSON.parse(cachedData)
        transactions = parsedData
        logger.info(
          'Using cached transaction data from ' +
          new Date(parseInt(localStorage.getItem('transactions_cache_time') || '0')).toLocaleString()
        )
        return parsedData
      }
    } catch (e) {
      logger.warn('Failed to load cached transactions:', e)
    }
    
    // Return current data if available
    return transactions
  } finally {
    loading = false
    logger.debug('Transactions loading completed:', transactions.length)
  }
}

/**
 * Get transactions with pagination, sorting, and filtering
 * @param filters Filters, pagination, and sorting options
 * @returns Promise resolving with filtered transactions and pagination info
 */
export const getTransactions = async (
  filters: Partial<TransactionFilters & Pagination & { sortBy?: keyof Transaction, sortingOrder?: SortingOrder }>
): Promise<{ data: Transaction[], pagination: Pagination }> => {
  const { isActive, search, sortBy, sortingOrder } = filters
  let filteredTransactions = [...transactions]
  
  // Set active status based on transaction status
  filteredTransactions = filteredTransactions.map((transaction) => ({
    ...transaction,
    active: transaction.status !== 'complete'
  }))
  
  // Apply active filter
  if (isActive !== undefined) {
    filteredTransactions = filteredTransactions.filter((transaction) => transaction.active === isActive)
  }
  
  // Apply search filter
  if (search) {
    const searchProperties = [
      'utid',
      'status',
      'raddress',
      'amount_xrp',
      'amount_xah',
      'given_rate',
      'creation_time',
    ]
    
    filteredTransactions = filteredTransactions.filter((transaction) =>
      searchProperties.some((property) => {
        const value = transaction[property as keyof Transaction]
        return value !== undefined && String(value).toLowerCase().includes(search.toLowerCase())
      })
    )
  }
  
  // Apply sorting
  if (sortBy && sortingOrder) {
    filteredTransactions = filteredTransactions.sort((a, b) => {
      const first = a[sortBy]
      const second = b[sortBy]
      
      if (first > second) {
        return sortingOrder === 'asc' ? 1 : -1
      }
      if (first < second) {
        return sortingOrder === 'asc' ? -1 : 1
      }
      return 0
    })
  }
  
  // Apply pagination
  const { page = 1, perPage = 10 } = filters
  const paginatedTransactions = filteredTransactions.slice((page - 1) * perPage, page * perPage)
  
  return {
    data: paginatedTransactions,
    pagination: {
      page,
      perPage,
      total: filteredTransactions.length,
    },
  }
}

/**
 * Get all transactions
 * @returns Promise resolving with all transactions
 */
export const getAllTransactions = async (): Promise<{ transactions: Transaction[] }> => {
  return {
    transactions,
  }
}

/**
 * Add a transaction
 * @param transaction The transaction to add
 */
export const addTransaction = async (transaction: Transaction): Promise<void> => {
  transactions.unshift(transaction)
}

/**
 * Update a transaction
 * @param transaction The transaction to update
 */
export const updateTransaction = async (transaction: Transaction): Promise<void> => {
  const index = transactions.findIndex((t) => t.utid === transaction.utid)
  if (index !== -1) {
    transactions[index] = transaction
  }
}

/**
 * Remove a transaction
 * @param transaction The transaction to remove
 */
export const removeTransaction = async (transaction: Transaction): Promise<void> => {
  const index = transactions.findIndex((t) => t.utid === transaction.utid)
  if (index !== -1) {
    transactions.splice(index, 1)
  }
}