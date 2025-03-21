/**
 * Network store
 */

import { StoreDefinition } from './types'

/**
 * Network store state
 */
export interface NetworkState {
  online: boolean
  lastOnline: number | null
  connectionType: string | null
  retryCount: number
}

/**
 * Network store definition
 */
export const networkStoreDefinition: StoreDefinition<NetworkState> = {
  id: 'network',
  
  state: () => ({
    online: navigator.onLine,
    lastOnline: navigator.onLine ? Date.now() : null,
    connectionType: null,
    retryCount: 0,
  }),
  
  getters: {
    isOnline: (state) => state.online,
    lastOnlineTime: (state) => state.lastOnline,
    timeSinceLastOnline: (state) => state.lastOnline ? Date.now() - state.lastOnline : null,
  },
  
  actions: {
    setOnline({ commit }, online: boolean) {
      commit('setOnline', online)
    },
    
    setConnectionType({ commit }, type: string | null) {
      commit('setConnectionType', type)
    },
    
    incrementRetryCount({ commit }) {
      commit('incrementRetryCount')
    },
    
    resetRetryCount({ commit }) {
      commit('resetRetryCount')
    },
  },
  
  mutations: {
    setOnline(state, online: boolean) {
      state.online = online
      
      if (online) {
        state.lastOnline = Date.now()
      }
    },
    
    setConnectionType(state, type: string | null) {
      state.connectionType = type
    },
    
    incrementRetryCount(state) {
      state.retryCount++
    },
    
    resetRetryCount(state) {
      state.retryCount = 0
    },
  },
}

/**
 * Setup network listeners
 * This function should be called once when the application starts
 * @param store The network store instance
 */
export function setupNetworkListeners(store: any) {
  // Listen for online/offline events
  window.addEventListener('online', () => {
    store.$commit('setOnline', true)
  })
  
  window.addEventListener('offline', () => {
    store.$commit('setOnline', false)
  })
  
  // Check connection type if available
  if ('connection' in navigator && navigator.connection) {
    const connection = navigator.connection as any
    
    store.$commit('setConnectionType', connection.effectiveType)
    
    // Listen for connection changes
    connection.addEventListener('change', () => {
      store.$commit('setConnectionType', connection.effectiveType)
    })
  }
}