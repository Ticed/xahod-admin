/**
 * Trades composable
 * Framework-agnostic implementation
 */

import { Order, Pagination, Sorting } from '../types'
import { getOrders } from '../data/trades'

/**
 * Filters for orders
 */
export interface OrderFilters {
  isActive?: boolean
  search?: string
}

/**
 * State for the useTrades composable
 */
export interface TradesState {
  isLoading: boolean
  orders: Order[]
  filters: Partial<OrderFilters>
  sorting: Sorting
  pagination: Pagination
}

/**
 * Result of the useTrades composable
 */
export interface TradesResult {
  isLoading: boolean
  orders: Order[]
  filters: Partial<OrderFilters>
  sorting: Sorting
  pagination: Pagination
  fetch: () => Promise<void>
}

/**
 * Options for the useTrades composable
 */
export interface TradesOptions {
  pagination?: Pagination
  sorting?: Sorting
  filters?: Partial<OrderFilters>
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
const defaultFilters: Partial<OrderFilters> = { isActive: false, search: '' }

/**
 * Create a trades state
 * @param options Options for the trades state
 * @returns Trades state
 */
export function createTradesState(options?: TradesOptions): TradesState {
  return {
    isLoading: false,
    orders: [],
    filters: options?.filters || { ...defaultFilters },
    sorting: options?.sorting || { ...defaultSorting },
    pagination: options?.pagination || { ...defaultPagination },
  }
}

/**
 * Fetch orders with the current filters, sorting, and pagination
 * @param state Trades state
 * @returns Promise resolving when the fetch is complete
 */
export async function fetchOrders(state: TradesState): Promise<void> {
  state.isLoading = true
  
  try {
    const { data, pagination } = await getOrders({
      ...state.filters,
      ...state.sorting,
      ...state.pagination,
    })
    
    state.orders = data
    
    // Ensure sorting order is not null
    if (state.sorting.sortingOrder === null) {
      state.sorting.sortingOrder = 'asc'
    }
    
    // Update pagination
    state.pagination = pagination
  } catch (error) {
    console.error('Error fetching orders:', error)
  } finally {
    state.isLoading = false
  }
}

/**
 * Update filters and fetch orders
 * @param state Trades state
 * @param filters New filters
 * @returns Promise resolving when the fetch is complete
 */
export async function updateFilters(state: TradesState, filters: Partial<OrderFilters>): Promise<void> {
  // Update filters
  state.filters = {
    ...state.filters,
    ...filters,
  }
  
  // Reset pagination to first page
  state.pagination.page = 1
  
  // Fetch orders with new filters
  await fetchOrders(state)
}

/**
 * Update sorting and fetch orders
 * @param state Trades state
 * @param sorting New sorting
 * @returns Promise resolving when the fetch is complete
 */
export async function updateSorting(state: TradesState, sorting: Partial<Sorting>): Promise<void> {
  // Update sorting
  state.sorting = {
    ...state.sorting,
    ...sorting,
  }
  
  // Fetch orders with new sorting
  await fetchOrders(state)
}

/**
 * Update pagination and fetch orders
 * @param state Trades state
 * @param pagination New pagination
 * @returns Promise resolving when the fetch is complete
 */
export async function updatePagination(state: TradesState, pagination: Partial<Pagination>): Promise<void> {
  // Update pagination
  state.pagination = {
    ...state.pagination,
    ...pagination,
  }
  
  // Fetch orders with new pagination
  await fetchOrders(state)
}