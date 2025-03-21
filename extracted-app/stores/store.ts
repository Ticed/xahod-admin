/**
 * Framework-agnostic store implementation
 */

import { StoreDefinition, StoreState, Store, StoreContext } from './types'

/**
 * Create a store from a store definition
 * @param definition The store definition
 * @returns The store instance
 */
export function createStore<S extends StoreState>(definition: StoreDefinition<S>): Store<S> {
  // Initialize state
  const initialState = typeof definition.state === 'function'
    ? (definition.state as () => S)()
    : { ...definition.state }
  
  // Create mutable state
  const state = { ...initialState }
  
  // Create subscribers array
  const subscribers: ((mutation: string, state: S) => void)[] = []
  
  // Create store context
  const context: StoreContext<S> = {
    state,
    dispatch: (action, payload) => store.$dispatch(action, payload),
    commit: (mutation, payload) => store.$commit(mutation, payload),
    getters: {},
  }
  
  // Initialize getters
  const getters: Record<string, any> = {}
  
  if (definition.getters) {
    Object.entries(definition.getters).forEach(([key, getter]) => {
      Object.defineProperty(getters, key, {
        get: () => getter(state),
        enumerable: true,
      })
    })
  }
  
  // Create store instance
  const store: Store<S> = {
    $id: definition.id,
    
    get $state() {
      return state
    },
    
    $dispatch: async (action, payload) => {
      if (!definition.actions || !definition.actions[action]) {
        throw new Error(`Action "${action}" is not defined in store "${definition.id}"`)
      }
      
      return definition.actions[action](context, payload)
    },
    
    $commit: (mutation, payload) => {
      if (!definition.mutations || !definition.mutations[mutation]) {
        throw new Error(`Mutation "${mutation}" is not defined in store "${definition.id}"`)
      }
      
      definition.mutations[mutation](state, payload)
      
      // Notify subscribers
      subscribers.forEach((callback) => callback(mutation, state))
    },
    
    $reset: () => {
      Object.keys(state).forEach((key) => {
        state[key] = initialState[key]
      })
      
      // Notify subscribers
      subscribers.forEach((callback) => callback('$reset', state))
    },
    
    $subscribe: (callback) => {
      subscribers.push(callback)
      
      // Return unsubscribe function
      return () => {
        const index = subscribers.indexOf(callback)
        if (index !== -1) {
          subscribers.splice(index, 1)
        }
      }
    },
    
    $patch: (partialState) => {
      Object.keys(partialState).forEach((key) => {
        state[key] = partialState[key]
      })
      
      // Notify subscribers
      subscribers.forEach((callback) => callback('$patch', state))
    },
  }
  
  // Add getters to store
  Object.keys(getters).forEach((key) => {
    Object.defineProperty(store, key, {
      get: () => getters[key],
      enumerable: true,
    })
  })
  
  // Add getters to context
  context.getters = getters
  
  return store
}