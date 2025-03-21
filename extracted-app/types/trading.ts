/**
 * Types related to trading functionality
 */

export type TradeStatus = 'open' | 'closed'
export type TradeType = 'buy' | 'sell'
export type OrderType = 'buy' | 'sell'

export type Trade = {
  utid: string
  id: number
  trade_id: string
  trade_type: TradeType
  status: TradeStatus
  creation_time: string
  currency: string
  currency_pair: string
  price: number
  quantity: number
  commission: number
  platform: string
  automated: boolean
  notes: string
}

export type Asset = 'XRP' | 'XAH' | string

export interface Balance {
  asset: Asset
  balance: number
}

export type Order = {
  utid: string
  trade_id: string
  trade_type: OrderType
  status: TradeStatus
  creation_time: string
  currency: string
  currency_pair: string
  price: number
  quantity: number
  commission: number
  platform: string
  automated: boolean
  notes: string
}

export type AccountType = 'service' | 'exchange' | 'cold' | 'general'
export type AccountMap = Record<string, string>

export type Account = {
  id: number
  account_id: string
  type: AccountType
  address: string
  balances: Balance[]
  active: boolean // Depends on the configuration of what accounts are in operational mode (i.e in use by the automatic rebalancer)
  healthy: boolean // Indicative of API call success
  error?: string // Optional error message when fetching account data fails
}