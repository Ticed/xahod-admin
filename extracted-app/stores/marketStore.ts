/**
 * Market store
 */

import { StoreDefinition } from './types'
import { MarketAsset } from '../types'
import { getAssetData } from '../data/market'

/**
 * Market store state
 */
export interface MarketState {
  assets: MarketAsset[]
  loading: boolean
}

/**
 * Market store definition
 */
export const marketStoreDefinition: StoreDefinition<MarketState> = {
  id: 'markets',
  
  state: () => ({
    assets: [],
    loading: false,
  }),
  
  getters: {
    allAssets: (state) => state.assets,
  },
  
  actions: {
    async load({ commit }) {
      commit('setLoading', true)
      
      try {
        const data = await getAssetData()
        commit('setAssets', data.marketAssets)
      } catch (error) {
        console.error('Error loading market assets:', error)
      } finally {
        commit('setLoading', false)
      }
    },
  },
  
  mutations: {
    setAssets(state, assets: MarketAsset[]) {
      state.assets = assets
    },
    
    setLoading(state, loading: boolean) {
      state.loading = loading
    },
  },
}