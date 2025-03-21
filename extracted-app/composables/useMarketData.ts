/**
 * Market data composable
 * Framework-agnostic implementation
 */

import { MarketAsset } from '../types'
import { addMarketAsset, getAssetData, removeMarketAsset } from '../data/market'

/**
 * State for the useMarketData composable
 */
export interface MarketDataState {
  isLoading: boolean
  assetsMarketData: MarketAsset[]
}

/**
 * Create a market data state
 * @returns Market data state
 */
export function createMarketDataState(): MarketDataState {
  return {
    isLoading: false,
    assetsMarketData: [],
  }
}

/**
 * Fetch market assets
 * @param state Market data state
 * @returns Promise resolving with a boolean indicating success
 */
export async function fetchMarketAssets(state: MarketDataState): Promise<boolean> {
  state.isLoading = true
  
  try {
    const latestData = await getAssetData()
    state.assetsMarketData = latestData.marketAssets
    
    return state.assetsMarketData.length > 0
  } catch (error) {
    console.error('Error fetching market assets:', error)
    return false
  } finally {
    state.isLoading = false
  }
}

/**
 * Add a market asset
 * @param state Market data state
 * @param asset The asset to add
 */
export function addAsset(state: MarketDataState, asset: MarketAsset): void {
  addMarketAsset(asset)
  
  // Update local state
  const existingAsset = state.assetsMarketData.find((a) => a.pair === asset.pair)
  if (existingAsset) {
    existingAsset.lastPrice = asset.lastPrice
  } else {
    state.assetsMarketData.push(asset)
  }
}

/**
 * Remove a market asset
 * @param state Market data state
 * @param asset The asset to remove
 */
export function removeAsset(state: MarketDataState, asset: MarketAsset): void {
  removeMarketAsset(asset)
  
  // Update local state
  const index = state.assetsMarketData.findIndex((a) => a.pair === asset.pair)
  if (index !== -1) {
    state.assetsMarketData.splice(index, 1)
  }
}