/**
 * Transfers composable
 * Framework-agnostic implementation
 */

import { Transfer, Pagination, Sorting } from '../types'
import { getTransfers } from '../data/transfers'

/**
 * Filters for transfers
 */
export interface TransferFilters {
  isActive?: boolean
  search?: string
}

/**
 * State for the useTransfers composable
 */
export interface TransfersState {
  isLoading: boolean
  transfers: Transfer[]
  filters: Partial<TransferFilters>
  sorting: Sorting
  pagination: Pagination
}

/**
 * Result of the useTransfers composable
 */
export interface TransfersResult {
  isLoading: boolean
  transfers: Transfer[]
  filters: Partial<TransferFilters>
  sorting: Sorting
  pagination: Pagination
  fetch: () => Promise<void>
}

/**
 * Options for the useTransfers composable
 */
export interface TransfersOptions {
  pagination?: Pagination
  sorting?: Sorting
  filters?: Partial<TransferFilters>
}

/**
 * Default pagination
 */
const defaultPagination: Pagination = { page: 1, perPage: 10, total: 0 }

/**
 * Default sorting
 */
const defaultSorting: Sorting = { sortBy: 'CreatedTimestamp', sortingOrder: 'asc' }

/**
 * Default filters
 */
const defaultFilters: Partial<TransferFilters> = { isActive: false, search: '' }

/**
 * Create a transfers state
 * @param options Options for the transfers state
 * @returns Transfers state
 */
export function createTransfersState(options?: TransfersOptions): TransfersState {
  return {
    isLoading: false,
    transfers: [],
    filters: options?.filters || { ...defaultFilters },
    sorting: options?.sorting || { ...defaultSorting },
    pagination: options?.pagination || { ...defaultPagination },
  }
}

/**
 * Fetch transfers with the current filters, sorting, and pagination
 * @param state Transfers state
 * @returns Promise resolving when the fetch is complete
 */
export async function fetchTransfers(state: TransfersState): Promise<void> {
  state.isLoading = true
  
  try {
    const { data, pagination } = await getTransfers({
      ...state.filters,
      ...state.sorting,
      ...state.pagination,
    })
    
    state.transfers = data
    
    // Ensure sorting order is not null
    if (state.sorting.sortingOrder === null) {
      state.sorting.sortingOrder = 'asc'
    }
    
    // Update pagination
    state.pagination = pagination
  } catch (error) {
    console.error('Error fetching transfers:', error)
  } finally {
    state.isLoading = false
  }
}

/**
 * Update filters and fetch transfers
 * @param state Transfers state
 * @param filters New filters
 * @returns Promise resolving when the fetch is complete
 */
export async function updateFilters(state: TransfersState, filters: Partial<TransferFilters>): Promise<void> {
  // Update filters
  state.filters = {
    ...state.filters,
    ...filters,
  }
  
  // Reset pagination to first page
  state.pagination.page = 1
  
  // Fetch transfers with new filters
  await fetchTransfers(state)
}

/**
 * Update sorting and fetch transfers
 * @param state Transfers state
 * @param sorting New sorting
 * @returns Promise resolving when the fetch is complete
 */
export async function updateSorting(state: TransfersState, sorting: Partial<Sorting>): Promise<void> {
  // Update sorting
  state.sorting = {
    ...state.sorting,
    ...sorting,
  }
  
  // Fetch transfers with new sorting
  await fetchTransfers(state)
}

/**
 * Update pagination and fetch transfers
 * @param state Transfers state
 * @param pagination New pagination
 * @returns Promise resolving when the fetch is complete
 */
export async function updatePagination(state: TransfersState, pagination: Partial<Pagination>): Promise<void> {
  // Update pagination
  state.pagination = {
    ...state.pagination,
    ...pagination,
  }
  
  // Fetch transfers with new pagination
  await fetchTransfers(state)
}