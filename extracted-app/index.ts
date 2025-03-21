/**
 * Main entry point for the extracted application code
 */

// Export all modules
export * from './types'
export * from './utils'
export * from './services'
export * from './data'
export * from './composables'
export * from './stores'
export * from './config'

// Export a function to initialize the application
export function initializeApp() {
  // Initialize stores
  const { networkStore, setupNetworkListeners } = require('./stores')
  
  // Setup network listeners
  setupNetworkListeners(networkStore)
  
  // Return the initialized application
  return {
    stores: require('./stores').stores,
    services: require('./services'),
    utils: require('./utils'),
    data: require('./data'),
    composables: require('./composables'),
    config: require('./config'),
  }
}