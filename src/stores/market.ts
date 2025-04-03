import { defineStore } from 'pinia';

interface HistoricalData {
  timestamp: string;
  xrpPrice: number;
  xahPrice: number;
  floatingRate: number;
}

interface MarketStore {
  xrpPrice: number;
  xahPrice: number;
  floatingRate: number;
  trades24h: number;
  volume24h: number;
  historicalData: HistoricalData[];
  profitability: number;
  loading: boolean;
}

export const useMarketStore = defineStore('market', {
  state: () => ({
    xrpPrice: 0,
    xahPrice: 0,
    floatingRate: 0,
    trades24h: 0,
    volume24h: 0,
    historicalData: [],
    profitability: 0,
    loading: false
  } as MarketStore),
  
  getters: {
    marketData: (state) => ({
      xrpPrice: state.xrpPrice,
      xahPrice: state.xahPrice,
      floatingRate: state.floatingRate
    }),
    metrics: (state) => ({
      trades24h: state.trades24h,
      volume24h: state.volume24h,
      profitability: state.profitability
    })
  },
  
  actions: {
    async fetchMarketData() {
      try {
        this.loading = true;
        // This would be replaced with actual API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Simulate data
        this.xrpPrice = +(Math.random() * (0.7 - 0.5) + 0.5).toFixed(6);
        this.xahPrice = +(Math.random() * (0.3 - 0.1) + 0.1).toFixed(6);
        this.floatingRate = +(this.xrpPrice / this.xahPrice).toFixed(4);
        this.trades24h = Math.floor(Math.random() * 100) + 50;
        this.volume24h = Math.floor(Math.random() * 100000) + 10000;
        this.profitability = +(Math.random() * (0.05 - 0.01) + 0.01).toFixed(4);
        
        // Generate historical data
        this.historicalData = Array(24).fill(null).map((_, i) => {
          const timestamp = new Date();
          timestamp.setHours(timestamp.getHours() - (23 - i));
          
          return {
            timestamp: timestamp.toISOString(),
            xrpPrice: +(Math.random() * (0.7 - 0.5) + 0.5).toFixed(6),
            xahPrice: +(Math.random() * (0.3 - 0.1) + 0.1).toFixed(6),
            floatingRate: +(Math.random() * (3 - 2) + 2).toFixed(4)
          };
        });
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        this.loading = false;
      }
    }
  }
}); 