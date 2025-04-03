<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useMarketStore } from '@/stores/market';
import { useTransactionsStore } from '@/stores/transactions';
import { useTradesStore } from '@/stores/trades';
import { TransactionStatus } from '@/stores/transactions';
import { TradeStatus } from '@/stores/trades';
import { BarChart, LineChartIcon, RefreshCcw, TrendingUp, TrendingDown, DollarSign } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const marketStore = useMarketStore();
const transactionsStore = useTransactionsStore();
const tradesStore = useTradesStore();
const router = useRouter();

const loading = ref(true);

onMounted(async () => {
  try {
    loading.value = true;
    
    // Fetch all required data in parallel
    await Promise.all([
      marketStore.fetchMarketData(),
      transactionsStore.fetchTransactions(),
      tradesStore.fetchTrades()
    ]);
    
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  } finally {
    loading.value = false;
  }
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 6,
    maximumFractionDigits: 6
  }).format(value);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US').format(value);
};

const formatPercent = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const navigateToTransaction = (utid: string) => {
  router.push(`/dashboard/transactions/${utid}`);
};

const navigateToTrade = (id: string) => {
  router.push(`/dashboard/trades/${id}`);
};

const getStatusColor = (status: TransactionStatus | TradeStatus) => {
  if (status === TransactionStatus.COMPLETED || status === TradeStatus.COMPLETED) {
    return 'text-green-500';
  } else if (status === TransactionStatus.FAILED || status === TradeStatus.FAILED) {
    return 'text-red-500';
  } else {
    return 'text-yellow-500';
  }
};
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Xahod HQ Dashboard</h1>
    
    <div v-if="loading" class="flex justify-center items-center h-[400px]">
      <div class="animate-spin">
        <RefreshCcw class="h-8 w-8 text-muted-foreground" />
      </div>
    </div>
    
    <div v-else>
      <!-- Market Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium">XRP Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between">
              <div class="text-2xl font-bold">{{ formatCurrency(marketStore.xrpPrice) }}</div>
              <div class="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                <TrendingUp class="h-4 w-4 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium">XAH Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between">
              <div class="text-2xl font-bold">{{ formatCurrency(marketStore.xahPrice) }}</div>
              <div class="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                <TrendingDown class="h-4 w-4 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium">XAH/XRP Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between">
              <div class="text-2xl font-bold">{{ marketStore.floatingRate.toFixed(4) }}</div>
              <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                <LineChartIcon class="h-4 w-4 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <!-- Performance Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium">24h Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between">
              <div class="text-2xl font-bold">{{ formatNumber(transactionsStore.metrics.total) }}</div>
              <div class="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                <RefreshCcw class="h-4 w-4 text-green-500" />
              </div>
            </div>
            <div class="text-xs text-muted-foreground mt-1">
              <span class="text-green-500">{{ transactionsStore.metrics.completed }}</span> completed, 
              <span class="text-yellow-500">{{ transactionsStore.metrics.pending }}</span> pending,
              <span class="text-red-500">{{ transactionsStore.metrics.failed }}</span> failed
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium">Trading Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between">
              <div class="text-2xl font-bold">{{ formatCurrency(marketStore.volume24h) }}</div>
              <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                <BarChart class="h-4 w-4 text-purple-500" />
              </div>
            </div>
            <div class="text-xs text-muted-foreground mt-1">
              {{ tradesStore.metrics.total }} trades today
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium">Profitability</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between">
              <div class="text-2xl font-bold">{{ formatPercent(marketStore.profitability) }}</div>
              <div class="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                <DollarSign class="h-4 w-4 text-green-500" />
              </div>
            </div>
            <div class="text-xs text-muted-foreground mt-1">
              Based on {{ tradesStore.metrics.completed }} completed trades
            </div>
          </CardContent>
        </Card>
      </div>
      
      <!-- Recent Transactions -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest XRP/XAH exchanges</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-2">
              <div v-for="tx in transactionsStore.transactions.slice(0, 5)" :key="tx.utid" 
                  class="p-3 border rounded cursor-pointer hover:bg-muted transition-colors"
                  @click="navigateToTransaction(tx.utid)">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium">{{ tx.utid }}</div>
                    <div class="text-sm text-muted-foreground">
                      {{ new Date(tx.timestamp).toLocaleString() }}
                    </div>
                  </div>
                  <div class="flex flex-col items-end">
                    <div>{{ tx.xrpAmount }} XRP → {{ tx.xahAmount }} XAH</div>
                    <div :class="getStatusColor(tx.status)" class="text-sm">{{ tx.status }}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <button class="text-blue-500 hover:underline text-sm" @click="router.push('/dashboard/transactions')">
              View all transactions
            </button>
          </CardFooter>
        </Card>
        
        <!-- Recent Trades -->
        <Card>
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
            <CardDescription>Latest market operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-2">
              <div v-for="trade in tradesStore.trades.slice(0, 5)" :key="trade.id" 
                  class="p-3 border rounded cursor-pointer hover:bg-muted transition-colors"
                  @click="navigateToTrade(trade.id)">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium">{{ trade.id }}</div>
                    <div class="text-sm text-muted-foreground">
                      {{ new Date(trade.timestamp).toLocaleString() }}
                    </div>
                  </div>
                  <div class="flex flex-col items-end">
                    <div class="text-sm" :class="trade.type === 'SELL' ? 'text-red-500' : 'text-green-500'">
                      {{ trade.type }} {{ trade.amount }} {{ trade.asset }}
                    </div>
                    <div :class="getStatusColor(trade.status)" class="text-sm">{{ trade.status }}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <button class="text-blue-500 hover:underline text-sm" @click="router.push('/dashboard/trades')">
              View all trades
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template> 