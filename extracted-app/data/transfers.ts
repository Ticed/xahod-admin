/**
 * Transfers data service
 */

import { Transfer, Pagination, Sorting, SortingOrder } from '../types'
import { apiService } from '../services'
import { logger } from '../services/logger'

/**
 * Filters for transfers
 */
export interface TransferFilters {
  isActive?: boolean
  search?: string
}

/**
 * Transfers data
 */
let transfers: Transfer[] = []
let loading = false

/**
 * Fetch transfers from the API
 * @returns Promise resolving with transfers
 */
export const fetchTransfers = async (): Promise<Transfer[]> => {
  loading = true
  const transfersTemp: Transfer[] = []
  let nextLink: string | null = '/data-api/rest/Transfer'
  
  try {
    while (nextLink) {
      const response = await apiService.get(nextLink)
      
      if (response.nextLink) {
        const url = new URL(response.nextLink)
        nextLink = url.pathname + url.search
        if (!nextLink.startsWith('/data-api')) {
          nextLink = '/data-api' + nextLink
        }
      } else {
        nextLink = null
      }
      
      transfersTemp.push(...response.value)
    }
    
    transfers = transfersTemp
    return transfers
  } catch (error) {
    logger.error('Error fetching transfers:', error)
    throw error
  } finally {
    loading = false
  }
}

/**
 * Get transfers with pagination, sorting, and filtering
 * @param filters Filters, pagination, and sorting options
 * @returns Promise resolving with filtered transfers and pagination info
 */
export const getTransfers = async (
  filters: Partial<TransferFilters & Pagination & { sortBy?: keyof Transfer, sortingOrder?: SortingOrder }>
): Promise<{ data: Transfer[], pagination: Pagination }> => {
  const { isActive, search, sortBy, sortingOrder } = filters
  let filteredTransfers = [...transfers]
  
  // Set active status based on transfer status
  filteredTransfers = filteredTransfers.map((transfer) => ({
    ...transfer,
    active: transfer.status !== 'complete'
  }))
  
  // Apply active filter
  if (isActive !== undefined) {
    filteredTransfers = filteredTransfers.filter((transfer) => transfer.active === isActive)
  }
  
  // Apply search filter
  if (search) {
    const searchProperties = [
      'id',
      'FromAccount',
      'to_acc',
      'amount',
      'currency',
      'CreatedTimestamp',
    ]
    
    filteredTransfers = filteredTransfers.filter((transfer) =>
      searchProperties.some((property) => {
        const value = transfer[property as keyof Transfer]
        return value !== undefined && String(value).toLowerCase().includes(search.toLowerCase())
      })
    )
  }
  
  // Apply sorting
  if (sortBy && sortingOrder) {
    filteredTransfers = filteredTransfers.sort((a, b) => {
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
  const paginatedTransfers = filteredTransfers.slice((page - 1) * perPage, page * perPage)
  
  return {
    data: paginatedTransfers,
    pagination: {
      page,
      perPage,
      total: filteredTransfers.length,
    },
  }
}

/**
 * Get all transfers
 * @returns Promise resolving with all transfers
 */
export const getAllTransfers = async (): Promise<{ transfers: Transfer[] }> => {
  return {
    transfers,
  }
}

/**
 * Add a transfer
 * @param transfer The transfer to add
 */
export const addTransfer = async (transfer: Transfer): Promise<void> => {
  transfers.unshift(transfer)
}

/**
 * Update a transfer
 * @param transfer The transfer to update
 */
export const updateTransfer = async (transfer: Transfer): Promise<void> => {
  const index = transfers.findIndex((t) => t.id === transfer.id)
  if (index !== -1) {
    transfers[index] = transfer
  }
}

/**
 * Remove a transfer
 * @param transfer The transfer to remove
 */
export const removeTransfer = async (transfer: Transfer): Promise<void> => {
  const index = transfers.findIndex((t) => t.id === transfer.id)
  if (index !== -1) {
    transfers.splice(index, 1)
  }
}