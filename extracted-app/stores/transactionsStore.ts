/**
 * Transactions store
 */

import { StoreDefinition } from './types'
import { Transaction } from '../types'
import { fetchTransactions } from '../data/transactions'

/**
 * Transactions store state
 */
export interface TransactionsState {
  transactions: Transaction[]
  loading: boolean
}

/**
 * Transactions store definition
 */
export const transactionsStoreDefinition: StoreDefinition<TransactionsState> = {
  id: 'transactions',
  
  state: () => ({
    transactions: [],
    loading: false,
  }),
  
  getters: {
    allTransactions: (state) => state.transactions,
    activeTransactions: (state) => state.transactions.filter(t => t.active),
    completedTransactions: (state) => state.transactions.filter(t => !t.active),
  },
  
  actions: {
    async load({ commit }) {
      commit('setLoading', true)
      
      try {
        const transactions = await fetchTransactions()
        commit('setTransactions', transactions)
      } catch (error) {
        console.error('Error loading transactions:', error)
      } finally {
        commit('setLoading', false)
      }
    },
    
    async addTransaction({ commit }, transaction: Transaction) {
      commit('addTransaction', transaction)
    },
    
    async updateTransaction({ commit }, transaction: Transaction) {
      commit('updateTransaction', transaction)
    },
    
    async removeTransaction({ commit }, transaction: Transaction) {
      commit('removeTransaction', transaction)
    },
  },
  
  mutations: {
    setTransactions(state, transactions: Transaction[]) {
      state.transactions = transactions
    },
    
    setLoading(state, loading: boolean) {
      state.loading = loading
    },
    
    addTransaction(state, transaction: Transaction) {
      state.transactions.unshift(transaction)
    },
    
    updateTransaction(state, transaction: Transaction) {
      const index = state.transactions.findIndex(t => t.utid === transaction.utid)
      if (index !== -1) {
        state.transactions[index] = transaction
      }
    },
    
    removeTransaction(state, transaction: Transaction) {
      const index = state.transactions.findIndex(t => t.utid === transaction.utid)
      if (index !== -1) {
        state.transactions.splice(index, 1)
      }
    },
  },
}