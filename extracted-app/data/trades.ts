/**
 * Trades data service
 */

import { Order, Pagination, Sorting, SortingOrder } from '../types'
import { apiService } from '../services'
import { logger } from '../services/logger'
import { sleep } from '../utils'

/**
 * Filters for orders
 */
export interface OrderFilters {
  isActive?: boolean
  search?: string
}

/**
 * Orders data
 */
let orders: Order[] = []
let loading = false

/**
 * Fetch orders from the API
 * @returns Promise resolving with orders
 */
export const fetchOrders = async (): Promise<Order[]> => {
  loading = true
  
  try {
    const ordersTemp: Order[] = []
    let nextLink: string | null = '/data-api/rest/Order'
    
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
      
      ordersTemp.push(...response.value)
    }
    
    orders = ordersTemp
    return orders
  } catch (error) {
    logger.error('Error fetching orders:', error)
    throw error
  } finally {
    loading = false
  }
}

/**
 * Load orders
 * @returns Promise resolving with orders
 */
export const loadOrders = async (): Promise<Order[]> => {
  try {
    return await fetchOrders()
  } catch (error) {
    logger.error('Error loading orders:', error)
    return []
  }
}

/**
 * Sync orders with the exchange
 * @returns Promise resolving with synced orders
 */
export const syncExchangeOrders = async (): Promise<any[]> => {
  try {
    const response = await apiService.get('/api/exchange?action=sync_exchange')
    logger.info('Synced exchange orders:', response)
    return response || []
  } catch (error) {
    logger.error('Error syncing exchange orders:', error)
    throw error
  }
}

/**
 * Get orders with pagination, sorting, and filtering
 * @param filters Filters, pagination, and sorting options
 * @returns Promise resolving with filtered orders and pagination info
 */
export const getOrders = async (
  filters: Partial<OrderFilters & Pagination & { sortBy?: keyof Order, sortingOrder?: SortingOrder }>
): Promise<{ data: Order[], pagination: Pagination }> => {
  await sleep(50) // Simulate API delay
  
  const { isActive, search, sortBy, sortingOrder } = filters
  let filteredOrders = [...orders]
  
  // Apply active filter
  if (isActive !== undefined) {
    filteredOrders = filteredOrders.filter((order) => {
      const isOrderActive = order.status === 'open'
      return isOrderActive === isActive
    })
  }
  
  // Apply search filter
  if (search) {
    const searchProperties = ['quantity', 'price', 'platform', 'currency_pair', 'creation_time', 'automated', 'trade_type']
    filteredOrders = filteredOrders.filter((order) =>
      searchProperties.some((property) => {
        const value = order[property as keyof Order]
        return value !== undefined && String(value).toLowerCase().includes(search.toLowerCase())
      })
    )
  }
  
  // Apply sorting
  if (sortBy && sortingOrder) {
    filteredOrders = filteredOrders.sort((a, b) => {
      const first = getSortItem(a, sortBy)
      const second = getSortItem(b, sortBy)
      
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
  const paginatedOrders = filteredOrders.slice((page - 1) * perPage, page * perPage)
  
  return {
    data: paginatedOrders,
    pagination: {
      page,
      perPage,
      total: filteredOrders.length,
    },
  }
}

/**
 * Get sort value from an object
 * @param obj The object to get the sort value from
 * @param sortBy The property to sort by
 * @returns The sort value
 */
const getSortItem = (obj: any, sortBy: string): any => {
  if (sortBy === 'creation_time') {
    return new Date(obj[sortBy]).getTime()
  }
  
  return obj[sortBy]
}

/**
 * Add an order
 * @param order The order to add
 */
export const addOrder = async (order: Order): Promise<void> => {
  orders.unshift(order)
}

/**
 * Update an order
 * @param order The order to update
 */
export const updateOrder = async (order: Order): Promise<void> => {
  const index = orders.findIndex((o) => o.utid === order.utid)
  if (index !== -1) {
    orders[index] = order
  }
}

/**
 * Remove an order
 * @param orderToRemove The order to remove
 */
export const removeOrder = async (orderToRemove: Order): Promise<void> => {
  const index = orders.findIndex((o) => o.utid === orderToRemove.utid)
  if (index !== -1) {
    orders.splice(index, 1)
  }
}