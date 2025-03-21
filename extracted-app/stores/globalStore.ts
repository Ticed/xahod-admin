/**
 * Global store
 */

import { StoreDefinition } from './types'
import { apiService } from '../services'

/**
 * Auth token interface
 */
export interface AuthToken {
  token: string
  expires: number
}

/**
 * Global store state
 */
export interface GlobalState {
  authToken: AuthToken
  dataLoading: boolean
  loadingCount: number
  darkMode: boolean
}

/**
 * Global store definition
 */
export const globalStoreDefinition: StoreDefinition<GlobalState> = {
  id: 'global',
  
  state: () => ({
    authToken: { token: '', expires: 0 },
    dataLoading: false,
    loadingCount: 0,
    darkMode: false,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.authToken.token && state.authToken.expires > Date.now(),
    isLoading: (state) => state.dataLoading || state.loadingCount > 0,
    isDarkMode: (state) => state.darkMode,
  },
  
  actions: {
    async loadAuthToken({ commit }) {
      try {
        // This would be implemented based on your authentication approach
        const response = await fetch('/api/auth/token')
        const data = await response.json()
        
        if (data.token) {
          const token: AuthToken = {
            token: data.token,
            expires: Date.now() + (data.expiresIn || 3600) * 1000,
          }
          
          commit('setAuthToken', token)
          
          // Set the token in the API service
          apiService.setAuthToken(token.token)
          
          return token
        }
      } catch (error) {
        console.error('Error loading auth token:', error)
      }
      
      return { token: '', expires: 0 }
    },
    
    setDarkMode({ commit }, isDark: boolean) {
      commit('setDarkMode', isDark)
    },
  },
  
  mutations: {
    setAuthToken(state, token: AuthToken) {
      state.authToken = token
    },
    
    setDataLoading(state, loading: boolean) {
      state.dataLoading = loading
    },
    
    incrementLoadingCount(state) {
      state.loadingCount++
    },
    
    decrementLoadingCount(state) {
      state.loadingCount = Math.max(0, state.loadingCount - 1)
    },
    
    setDarkMode(state, isDark: boolean) {
      state.darkMode = isDark
    },
  },
}