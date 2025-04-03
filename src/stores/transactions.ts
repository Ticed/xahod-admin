import { defineStore } from 'pinia';

export enum TransactionStatus {
  INITIATED = 'INITIATED',
  PROCESSING = 'PROCESSING',
  ISSUED = 'ISSUED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum ProfitStatus {
  PENDING = 'PENDING',
  REALIZED = 'REALIZED',
  LOST = 'LOST'
}

export interface Transaction {
  utid: string;
  status: TransactionStatus;
  xrpAmount: string;
  xahAmount: string;
  timestamp: string;
  xrpTxHash: string;
  xahTxHash: string;
  profitStatus: ProfitStatus;
  profitability?: number;
}

interface TransactionsState {
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
  loading: boolean;
  filters: {
    status: TransactionStatus | null;
    fromDate: string | null;
    toDate: string | null;
  };
}

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    transactions: [],
    selectedTransaction: null,
    loading: false,
    filters: {
      status: null,
      fromDate: null,
      toDate: null
    }
  } as TransactionsState),
  
  getters: {
    filteredTransactions: (state) => {
      return state.transactions.filter(tx => {
        if (state.filters.status && tx.status !== state.filters.status) {
          return false;
        }
        
        if (state.filters.fromDate) {
          const fromDate = new Date(state.filters.fromDate);
          const txDate = new Date(tx.timestamp);
          if (txDate < fromDate) {
            return false;
          }
        }
        
        if (state.filters.toDate) {
          const toDate = new Date(state.filters.toDate);
          const txDate = new Date(tx.timestamp);
          if (txDate > toDate) {
            return false;
          }
        }
        
        return true;
      });
    },
    
    metrics: (state) => {
      const total = state.transactions.length;
      const completed = state.transactions.filter(tx => tx.status === TransactionStatus.COMPLETED).length;
      const failed = state.transactions.filter(tx => tx.status === TransactionStatus.FAILED).length;
      const pending = total - completed - failed;
      
      return { total, completed, failed, pending };
    }
  },
  
  actions: {
    async fetchTransactions() {
      try {
        this.loading = true;
        // This would be replaced with actual API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate mock transactions
        const statuses = Object.values(TransactionStatus);
        const profitStatuses = Object.values(ProfitStatus);
        
        this.transactions = Array(20).fill(null).map((_, index) => {
          const timestamp = new Date();
          timestamp.setHours(timestamp.getHours() - Math.floor(Math.random() * 48));
          
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          const profitStatus = profitStatuses[Math.floor(Math.random() * profitStatuses.length)];
          
          const xrpAmount = (Math.random() * (1000 - 100) + 100).toFixed(2);
          const xahExchangeRate = (Math.random() * (3 - 2) + 2).toFixed(4);
          
          return {
            utid: `TX-${Date.now()}-${index}`,
            status,
            xrpAmount,
            xahAmount: (parseFloat(xrpAmount) * parseFloat(xahExchangeRate)).toFixed(2),
            timestamp: timestamp.toISOString(),
            xrpTxHash: `xrp-${Math.random().toString(36).substring(2, 15)}`,
            xahTxHash: `xah-${Math.random().toString(36).substring(2, 15)}`,
            profitStatus,
            profitability: profitStatus === ProfitStatus.REALIZED ? +(Math.random() * 0.05).toFixed(4) : undefined
          };
        });
        
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async getTransactionDetails(utid: string) {
      try {
        this.loading = true;
        const transaction = this.transactions.find(tx => tx.utid === utid);
        
        if (transaction) {
          this.selectedTransaction = transaction;
        }
      } catch (error) {
        console.error('Error fetching transaction details:', error);
      } finally {
        this.loading = false;
      }
    },
    
    updateFilters(filters: Partial<TransactionsState['filters']>) {
      this.filters = { ...this.filters, ...filters };
    },
    
    clearFilters() {
      this.filters = {
        status: null,
        fromDate: null,
        toDate: null
      };
    }
  }
}); 