/**
 * Re-export all stores
 */

import { createStore } from './store'
import { globalStoreDefinition } from './globalStore'
import { marketStoreDefinition } from './marketStore'
import { networkStoreDefinition } from './networkStore'
import { ordersStoreDefinition } from './ordersStore'
import { transactionsStoreDefinition } from './transactionsStore'
import { transfersStoreDefinition } from './transfersStore'

// Export store definitions
export * from './types'
export * from './store'
export * from './globalStore'
export * from './marketStore'
export * from './networkStore'
export * from './ordersStore'
export * from './transactionsStore'
export * from './transfersStore'

// Create store instances
export const globalStore = createStore(globalStoreDefinition)
export const marketStore = createStore(marketStoreDefinition)
export const networkStore = createStore(networkStoreDefinition)
export const ordersStore = createStore(ordersStoreDefinition)
export const transactionsStore = createStore(transactionsStoreDefinition)
export const transfersStore = createStore(transfersStoreDefinition)

// Export all stores
export const stores = {
  global: globalStore,
  market: marketStore,
  network: networkStore,
  orders: ordersStore,
  transactions: transactionsStore,
  transfers: transfersStore,
}