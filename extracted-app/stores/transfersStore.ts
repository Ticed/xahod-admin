/**
 * Transfers store
 */

import { StoreDefinition } from './types'
import { Transfer } from '../types'
import { fetchTransfers } from '../data/transfers'

/**
 * Transfers store state
 */
export interface TransfersState {
  transfers: Transfer[]
  loading: boolean
}

/**
 * Transfers store definition
 */
export const transfersStoreDefinition: StoreDefinition<TransfersState> = {
  id: 'transfers',
  
  state: () => ({
    transfers: [],
    loading: false,
  }),
  
  getters: {
    allTransfers: (state) => state.transfers,
    activeTransfers: (state) => state.transfers.filter(t => t.active),
    completedTransfers: (state) => state.transfers.filter(t => !t.active),
  },
  
  actions: {
    async load({ commit }) {
      commit('setLoading', true)
      
      try {
        const transfers = await fetchTransfers()
        commit('setTransfers', transfers)
      } catch (error) {
        console.error('Error loading transfers:', error)
      } finally {
        commit('setLoading', false)
      }
    },
    
    async addTransfer({ commit }, transfer: Transfer) {
      commit('addTransfer', transfer)
    },
    
    async updateTransfer({ commit }, transfer: Transfer) {
      commit('updateTransfer', transfer)
    },
    
    async removeTransfer({ commit }, transfer: Transfer) {
      commit('removeTransfer', transfer)
    },
  },
  
  mutations: {
    setTransfers(state, transfers: Transfer[]) {
      state.transfers = transfers
    },
    
    setLoading(state, loading: boolean) {
      state.loading = loading
    },
    
    addTransfer(state, transfer: Transfer) {
      state.transfers.unshift(transfer)
    },
    
    updateTransfer(state, transfer: Transfer) {
      const index = state.transfers.findIndex(t => t.id === transfer.id)
      if (index !== -1) {
        state.transfers[index] = transfer
      }
    },
    
    removeTransfer(state, transfer: Transfer) {
      const index = state.transfers.findIndex(t => t.id === transfer.id)
      if (index !== -1) {
        state.transfers.splice(index, 1)
      }
    },
  },
}