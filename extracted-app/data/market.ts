/**
 * Market data service
 */

import { MarketAsset, FloatingRateIndexData, TradingRatesData } from '../types'
import { apiService } from '../services'
import { logger } from '../services/logger'

/**
 * Market assets data
 */
export const marketAssets: MarketAsset[] = []

/**
 * Fetch market data from the API
 * @returns Promise resolving with market assets
 */
export const fetchMarketData = async (): Promise<MarketAsset[]> => {
  try {
    const response = await apiService.get('/api/market')
    
    // Process the response data
    Object.keys(response).forEach((key) => {
      const symbol = response[key]['symbol']
      const lastPrice = response[key]['last']

      const existingAsset = marketAssets.find((asset) => asset.pair === symbol)
      if (existingAsset) {
        existingAsset.lastPrice = lastPrice
      } else {
        const assetInstance: MarketAsset = {
          displayName: symbol,
          pair: symbol,
          lastPrice: lastPrice,
        }
        marketAssets.push(assetInstance)
      }
    })

    return marketAssets
  } catch (error) {
    logger.error('Error fetching market data:', error)
    throw error
  }
}

/**
 * Pre-populate market data with default values
 * @returns Array of market assets with default values
 */
export const prePopulateMarketData = (): MarketAsset[] => {
  const assetInstances: MarketAsset[] = []
  
  const assetInstance1: MarketAsset = {
    displayName: 'XRP/USDT',
    pair: 'XRP/USDT',
    lastPrice: undefined,
  }
  
  const assetInstance2: MarketAsset = {
    displayName: 'XAH/USDT',
    pair: 'XAH/USDT',
    lastPrice: undefined,
  }
  
  assetInstances.push(assetInstance1)
  assetInstances.push(assetInstance2)
  
  // Update the marketAssets array
  marketAssets.length = 0
  marketAssets.push(...assetInstances)
  
  return assetInstances
}

/**
 * Get asset data from the API
 * @returns Promise resolving with market assets
 */
export const getAssetData = async (): Promise<{ marketAssets: MarketAsset[] }> => {
  const filteredMarketData = await fetchMarketData()
  
  return {
    marketAssets: filteredMarketData,
  }
}

/**
 * Add a market asset
 * @param assetData The asset data to add
 */
export const addMarketAsset = (assetData: MarketAsset): void => {
  const existingAsset = marketAssets.find((asset) => asset.pair === assetData.pair)
  
  if (existingAsset) {
    existingAsset.lastPrice = assetData.lastPrice
  } else {
    const assetInstance: MarketAsset = {
      displayName: assetData.pair,
      pair: assetData.pair,
      lastPrice: assetData.lastPrice,
    }
    marketAssets.push(assetInstance)
  }
}

/**
 * Remove a market asset
 * @param asset The asset to remove
 */
export const removeMarketAsset = async (asset: MarketAsset): Promise<void> => {
  // Implementation would depend on specific requirements
  const index = marketAssets.findIndex((a) => a.pair === asset.pair)
  if (index !== -1) {
    marketAssets.splice(index, 1)
  }
}

/**
 * Fetch trading rates data
 * @returns Promise resolving with trading rates data
 */
export const fetchTradingRatesData = async (): Promise<TradingRatesData> => {
  try {
    const response = await apiService.get('/api/market/rates')
    
    return {
      floatingRates: response.floatingRates || [],
      xahPrice: response.xahPrice || 0,
      xrpPrice: response.xrpPrice || 0,
    }
  } catch (error) {
    logger.error('Error fetching trading rates data:', error)
    throw error
  }
}