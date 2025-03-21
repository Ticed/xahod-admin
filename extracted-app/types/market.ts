/**
 * Types related to market data
 */

export type MarketAsset = {
  displayName: string
  pair: string
  lastPrice: string | undefined
}

export type FloatingRateIndexData = { 
  vol: number
  floating_rate: number 
}

export type TradingRatesData = { 
  floatingRates: FloatingRateIndexData[]
  xahPrice: number
  xrpPrice: number 
}