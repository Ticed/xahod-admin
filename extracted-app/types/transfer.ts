/**
 * Types related to transfers
 */

export type Transfer = {
  id: string
  CreatedTimestamp: string
  CompletedTimestamp: string
  FromAccount: string
  to_acc: string
  amount: string
  currency: string
  payload: string
  expires_by: string
  status: string
  active: boolean
  LookupHash: string
}

export type TransferStatus = 'created' | 'processing' | 'complete' | 'pending_sig' | 'submitted' | 'rejected' | 'expired'

export type TransferSignature = {
  TransferId: string
  Signature: string
  RAddress: string
}

export type TransferWithSignature = Transfer & TransferSignature