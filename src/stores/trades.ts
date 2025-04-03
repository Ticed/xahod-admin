import { defineStore } from 'pinia';

export enum TradeStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum TradeType {
  SELL = 'SELL',
  BUY = 'BUY'
}

export interface Trade {
  id: string;
  type: TradeType;
  asset: 'XRP' | 'XAH';
  amount: string;
  price: string;
  timestamp: string;
  status: TradeStatus;
  relatedTransaction: string;
  profitability?: number;
}

interface TradesState {
  trades: Trade[];
  selectedTrade: Trade | null;
  loading: boolean;
  filters: {
    type: TradeType | null;
    status: TradeStatus | null;
    fromDate: string | null;
    toDate: string | null;
  };
}

export const useTradesStore = defineStore('trades', {
  state: () => ({
    trades: [],
    selectedTrade: null,
    loading: false,
    filters: {
      type: null,
      status: null,
      fromDate: null,
      toDate: null
    }
  } as TradesState),
  
  getters: {
    filteredTrades: (state) => {
      return state.trades.filter(trade => {
        if (state.filters.type && trade.type !== state.filters.type) {
          return false;
        }
        
        if (state.filters.status && trade.status !== state.filters.status) {
          return false;
        }
        
        if (state.filters.fromDate) {
          const fromDate = new Date(state.filters.fromDate);
          const tradeDate = new Date(trade.timestamp);
          if (tradeDate < fromDate) {
            return false;
          }
        }
        
        if (state.filters.toDate) {
          const toDate = new Date(state.filters.toDate);
          const tradeDate = new Date(trade.timestamp);
          if (tradeDate > toDate) {
            return false;
          }
        }
        
        return true;
      });
    },
    
    metrics: (state) => {
      const total = state.trades.length;
      const completed = state.trades.filter(t => t.status === TradeStatus.COMPLETED).length;
      const failed = state.trades.filter(t => t.status === TradeStatus.FAILED).length;
      const pending = total - completed - failed;
      
      const sellTrades = state.trades.filter(t => t.type === TradeType.SELL).length;
      const buyTrades = state.trades.filter(t => t.type === TradeType.BUY).length;
      
      return { total, completed, failed, pending, sellTrades, buyTrades };
    }
  },
  
  actions: {
    async fetchTrades() {
      try {
        this.loading = true;
        // This would be replaced with actual API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate mock trades
        const statuses = Object.values(TradeStatus);
        const types = Object.values(TradeType);
        const assets = ['XRP', 'XAH'] as const;
        
        this.trades = Array(30).fill(null).map((_, index) => {
          const timestamp = new Date();
          timestamp.setHours(timestamp.getHours() - Math.floor(Math.random() * 48));
          
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          const type = types[Math.floor(Math.random() * types.length)];
          const asset = assets[Math.floor(Math.random() * assets.length)];
          
          const amount = (Math.random() * (1000 - 100) + 100).toFixed(2);
          const price = asset === 'XRP' 
            ? (Math.random() * (0.7 - 0.5) + 0.5).toFixed(6)
            : (Math.random() * (0.3 - 0.1) + 0.1).toFixed(6);
          
          return {
            id: `TR-${Date.now()}-${index}`,
            type,
            asset,
            amount,
            price,
            timestamp: timestamp.toISOString(),
            status,
            relatedTransaction: `TX-${Math.random().toString(36).substring(2, 10)}`,
            profitability: status === TradeStatus.COMPLETED ? +(Math.random() * 0.05).toFixed(4) : undefined
          };
        });
        
      } catch (error) {
        console.error('Error fetching trades:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async getTradeDetails(id: string) {
      try {
        this.loading = true;
        const trade = this.trades.find(t => t.id === id);
        
        if (trade) {
          this.selectedTrade = trade;
        }
      } catch (error) {
        console.error('Error fetching trade details:', error);
      } finally {
        this.loading = false;
      }
    },
    
    updateFilters(filters: Partial<TradesState['filters']>) {
      this.filters = { ...this.filters, ...filters };
    },
    
    clearFilters() {
      this.filters = {
        type: null,
        status: null,
        fromDate: null,
        toDate: null
      };
    }
  }
}); 