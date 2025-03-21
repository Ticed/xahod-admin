/**
 * Types related to transactions
 */

export type TransactionStatus = 'created' | 'processing' | 'issued' | 'complete' | 'trading' | 'pending' | 'failed'

export type Transaction = {
  utid: string
  status: TransactionStatus
  raddress: string
  amount_xrp: string
  amount_xah: string
  given_rate: string
  price_market_xrp: string
  price_market_xah: string
  tx_hash_xrp: string
  tx_hash_xah: string
  memo_data: string
  creation_time: string
  notes: string
  active: boolean
}