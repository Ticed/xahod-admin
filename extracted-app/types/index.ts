/**
 * Re-export all types for easier imports
 */

export * from './market'
export * from './trading'
export * from './transactions'
export * from './transfer'

// Additional common types
export type xAppMoment = {
  moment: string // datetime
  account: string
  user: string
  locale: string
  version: string
  style: string
  ipcountry: string
}

// Pagination and filtering types
export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type SortingOrder = 'asc' | 'desc' | null

export type Sorting<T = any> = {
  sortBy: keyof T | undefined
  sortingOrder: SortingOrder
}