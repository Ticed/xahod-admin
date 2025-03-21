/**
 * Orders store
 */

import { StoreDefinition } from './types'
import { Order } from '../types'
import { fetchOrders, syncExchangeOrders } from '../data/trades'

/**
 * Orders store state
 */
export interface OrdersState {
  orders: Order[]
  loading: boolean
}

/**
 * Orders store definition
 */
export const ordersStoreDefinition: StoreDefinition<OrdersState> = {
  id: 'orders',
  
  state: () => ({
    orders: [],
    loading: false,
  }),
  
  getters: {
    allOrders: (state) => state.orders,
    activeOrders: (state) => state.orders.filter(o => o.status === 'open'),
    completedOrders: (state) => state.orders.filter(o => o.status === 'closed'),
  },
  
  actions: {
    async load({ commit }) {
      commit('setLoading', true)
      
      try {
        const orders = await fetchOrders()
        commit('setOrders', orders)
      } catch (error) {
        console.error('Error loading orders:', error)
      } finally {
        commit('setLoading', false)
      }
    },
    
    async syncExchange({ commit }) {
      commit('setLoading', true)
      
      try {
        const result = await syncExchangeOrders()
        console.log('Exchange orders synced:', result)
        
        // Reload orders after sync
        const orders = await fetchOrders()
        commit('setOrders', orders)
      } catch (error) {
        console.error('Error syncing exchange orders:', error)
      } finally {
        commit('setLoading', false)
      }
    },
    
    async addOrder({ commit }, order: Order) {
      commit('addOrder', order)
    },
    
    async updateOrder({ commit }, order: Order) {
      commit('updateOrder', order)
    },
    
    async removeOrder({ commit }, order: Order) {
      commit('removeOrder', order)
    },
  },
  
  mutations: {
    setOrders(state, orders: Order[]) {
      state.orders = orders
    },
    
    setLoading(state, loading: boolean) {
      state.loading = loading
    },
    
    addOrder(state, order: Order) {
      state.orders.unshift(order)
    },
    
    updateOrder(state, order: Order) {
      const index = state.orders.findIndex(o => o.utid === order.utid)
      if (index !== -1) {
        state.orders[index] = order
      }
    },
    
    removeOrder(state, order: Order) {
      const index = state.orders.findIndex(o => o.utid === order.utid)
      if (index !== -1) {
        state.orders.splice(index, 1)
      }
    },
  },
}