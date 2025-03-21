/**
 * Transactions composable
 * Framework-agnostic implementation
 */

import { Transaction, Pagination, Sorting } from '../types'
import { getTransactions } from '../data/transactions'

/**
 * Filters for transactions
 */
export interface TransactionFilters {
  isActive?: boolean
  search?: string
}

/**
 * State for the useTransactions composable
 */
export interface TransactionsState {
  isLoading: boolean
  transactions: Transaction[]
  filters: Partial<TransactionFilters>
  sorting: Sorting
  pagination: Pagination
}

/**
 * Result of the useTransactions composable
 */
export interface TransactionsResult {
  isLoading: boolean
  transactions: Transaction[]
  filters: Partial<TransactionFilters>
  sorting: Sorting
  pagination: Pagination
  fetch: () => Promise<void>
}

/**
 * Options for the useTransactions composable
 */
export interface TransactionsOptions {
  pagination?: Pagination
  sorting?: Sorting
  filters?: Partial<TransactionFilters>
}

/**
 * Default pagination
 */
const defaultPagination: Pagination = { page: 1, perPage: 10, total: 0 }

/**
 * Default sorting
 */
const defaultSorting: Sorting = { sortBy: 'creation_time', sortingOrder: 'asc' }

/**
 * Default filters
 */
const defaultFilters: Partial<TransactionFilters> = { isActive: false, search: '' }

/**
 * Create a transactions state
 * @param options Options for the transactions state
 * @returns Transactions state
 */
export function createTransactionsState(options?: TransactionsOptions): TransactionsState {
  return {
    isLoading: false,
    transactions: [],
    filters: options?.filters || { ...defaultFilters },
    sorting: options?.sorting || { ...defaultSorting },
    pagination: options?.pagination || { ...defaultPagination },
  }
}

/**
 * Fetch transactions with the current filters, sorting, and pagination
 * @param state Transactions state
 * @returns Promise resolving when the fetch is complete
 */
export async function fetchTransactions(state: TransactionsState): Promise<void> {
  state.isLoading = true
  
  try {
    const { data, pagination } = await getTransactions({
      ...state.filters,
      ...state.sorting,
      ...state.pagination,
    })
    
    state.transactions = data
    
    // Ensure sorting order is not null
    if (state.sorting.sortingOrder === null) {
      state.sorting.sortingOrder = 'asc'
    }
    
    // Update pagination
    state.pagination = pagination
  } catch (error) {
    console.error('Error fetching transactions:', error)
  } finally {
    state.isLoading = false
  }
}

/**
 * Update filters and fetch transactions
 * @param state Transactions state
 * @param filters New filters
 * @returns Promise resolving when the fetch is complete
 */
export async function updateFilters(state: TransactionsState, filters: Partial<TransactionFilters>): Promise<void> {
  // Update filters
  state.filters = {
    ...state.filters,
    ...filters,
  }
  
  // Reset pagination to first page
  state.pagination.page = 1
  
  // Fetch transactions with new filters
  await fetchTransactions(state)
}

/**
 * Update sorting and fetch transactions
 * @param state Transactions state
 * @param sorting New sorting
 * @returns Promise resolving when the fetch is complete
 */
export async function updateSorting(state: TransactionsState, sorting: Partial<Sorting>): Promise<void> {
  // Update sorting
  state.sorting = {
    ...state.sorting,
    ...sorting,
  }
  
  // Fetch transactions with new sorting
  await fetchTransactions(state)
}

/**
 * Update pagination and fetch transactions
 * @param state Transactions state
 * @param pagination New pagination
 * @returns Promise resolving when the fetch is complete
 */
export async function updatePagination(state: TransactionsState, pagination: Partial<Pagination>): Promise<void> {
  // Update pagination
  state.pagination = {
    ...state.pagination,
    ...pagination,
  }
  
  // Fetch transactions with new pagination
  await fetchTransactions(state)
}