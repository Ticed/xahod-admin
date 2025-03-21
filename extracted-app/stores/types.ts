/**
 * State management types
 * These types define a framework-agnostic state management interface
 */

/**
 * Base store state interface
 * All store states should extend this interface
 */
export interface StoreState {
  [key: string]: any
}

/**
 * Store getter function
 * @param state The store state
 * @returns The computed value
 */
export type StoreGetter<S extends StoreState, R> = (state: S) => R

/**
 * Store action function
 * @param context The store context
 * @param payload The action payload
 * @returns A promise or void
 */
export type StoreAction<S extends StoreState, P = any, R = any> = (
  context: StoreContext<S>,
  payload?: P
) => Promise<R> | R

/**
 * Store mutation function
 * @param state The store state
 * @param payload The mutation payload
 */
export type StoreMutation<S extends StoreState, P = any> = (
  state: S,
  payload?: P
) => void

/**
 * Store context interface
 * Provides access to the store's state, getters, and methods to dispatch actions and commit mutations
 */
export interface StoreContext<S extends StoreState> {
  /** The store state */
  state: S
  /** Dispatch an action */
  dispatch: <P = any, R = any>(action: string, payload?: P) => Promise<R>
  /** Commit a mutation */
  commit: <P = any>(mutation: string, payload?: P) => void
  /** Get a getter value */
  getters: Record<string, any>
}

/**
 * Store definition interface
 * Defines the structure of a store
 */
export interface StoreDefinition<S extends StoreState> {
  /** The store ID */
  id: string
  /** The store state */
  state: S | (() => S)
  /** The store getters */
  getters?: Record<string, StoreGetter<S, any>>
  /** The store actions */
  actions?: Record<string, StoreAction<S, any, any>>
  /** The store mutations */
  mutations?: Record<string, StoreMutation<S, any>>
}

/**
 * Store instance interface
 * Represents an instantiated store
 */
export interface Store<S extends StoreState> {
  /** The store ID */
  $id: string
  /** The store state */
  $state: S
  /** Dispatch an action */
  $dispatch: <P = any, R = any>(action: string, payload?: P) => Promise<R>
  /** Commit a mutation */
  $commit: <P = any>(mutation: string, payload?: P) => void
  /** Reset the store state to its initial value */
  $reset: () => void
  /** Subscribe to store changes */
  $subscribe: (callback: (mutation: string, state: S) => void) => () => void
  /** Patch the store state */
  $patch: (partialState: Partial<S>) => void
  /** Get a getter value */
  [key: string]: any
}