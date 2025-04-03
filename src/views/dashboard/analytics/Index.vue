<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMarketStore } from '@/stores/market';
import { useTransactionsStore } from '@/stores/transactions';
import { useTradesStore } from '@/stores/trades';
import { RefreshCcw, ArrowUpRight, ArrowDownRight, Coins, BarChart3, LineChart, PieChart } from 'lucide-vue-next';

const marketStore = useMarketStore();
const transactionsStore = useTransactionsStore();
const tradesStore = useTradesStore();
const loading = ref(true);
const activeTab = ref('overview');

// Dummy data for charts
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const currentMonth = new Date().getMonth();
const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
  const monthIndex = (currentMonth - i + 12) % 12;
  return monthNames[monthIndex];
}).reverse();

const profitData = {
  labels: lastSixMonths,
  values: [25000, 32000, 28000, 40000, 50000, 65000],
};

const volumeData = {
  labels: lastSixMonths,
  values: [120000, 150000, 100000, 200000, 250000, 300000],
};

// Function to refresh all data
const refreshData = async () => {
  try {
    loading.value = true;
    await Promise.all([
      marketStore.fetchMarketData(),
      transactionsStore.fetchTransactions(),
      tradesStore.fetchTrades()
    ]);
  } catch (error) {
    console.error('Error loading analytics data:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(refreshData);

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const formatPercent = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Computed values
const totalTransactions = transactionsStore.transactions.length;
const totalTrades = tradesStore.trades.length;
const totalVolume = transactionsStore.transactions.reduce((sum, tx) => sum + Number(tx.xrpAmount), 0);
const totalProfit = tradesStore.trades.reduce((sum, trade) => sum + (trade.profitability || 0), 0);
const profitPercentage = totalVolume > 0 ? totalProfit / totalVolume : 0;
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Analytics Dashboard</h1>
      
      <div class="flex gap-2">
        <button class="flex items-center text-sm text-muted-foreground hover:text-foreground" @click="refreshData">
          <RefreshCcw class="h-4 w-4 mr-1" />
          Refresh Data
        </button>
      </div>
    </div>
    
    <div v-if="loading" class="flex justify-center items-center h-[400px]">
      <div class="animate-spin">
        <RefreshCcw class="h-8 w-8 text-muted-foreground" />
      </div>
    </div>
    
    <div v-else>
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium">Total Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between">
              <div class="text-2xl font-bold">{{ formatCurrency(totalVolume) }}</div>
              <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Coins class="h-4 w-4 text-blue-500" />
              </div>
            </div>
            <p class="text-xs text-muted-foreground mt-1">
              Lifetime transaction volume
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium">Total Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between">
              <div class="text-2xl font-bold">{{ formatCurrency(totalProfit) }}</div>
              <div class="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                <ArrowUpRight class="h-4 w-4 text-green-500" />
              </div>
            </div>
            <p class="text-xs text-muted-foreground mt-1">
              Net profit: <span class="text-green-500">{{ formatPercent(profitPercentage) }}</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between">
              <div class="text-2xl font-bold">{{ totalTransactions.toLocaleString() }}</div>
              <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                <BarChart3 class="h-4 w-4 text-purple-500" />
              </div>
            </div>
            <p class="text-xs text-muted-foreground mt-1">
              All time transactions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium">Total Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between">
              <div class="text-2xl font-bold">{{ totalTrades.toLocaleString() }}</div>
              <div class="p-2 bg-amber-100 dark:bg-amber-900 rounded-full">
                <LineChart class="h-4 w-4 text-amber-500" />
              </div>
            </div>
            <p class="text-xs text-muted-foreground mt-1">
              All time completed trades
            </p>
          </CardContent>
        </Card>
      </div>
      
      <!-- Charts Tabs -->
      <Card>
        <CardHeader>
          <CardTitle>Performance Analytics</CardTitle>
          <CardDescription>Trading volume and profitability metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" class="w-full" v-model="activeTab">
            <TabsList class="grid grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="profit">Profit Analysis</TabsTrigger>
              <TabsTrigger value="volume">Volume Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" class="mt-0">
              <div class="flex flex-col space-y-4">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <!-- Profit Chart -->
                  <div>
                    <h3 class="text-sm font-medium mb-2">Monthly Profit</h3>
                    <div class="h-[300px] bg-muted/30 rounded-lg flex items-center justify-center">
                      <div class="flex flex-col items-center space-y-2">
                        <LineChart class="h-8 w-8 text-muted-foreground" />
                        <p class="text-muted-foreground">Profit Trend Chart (6 Months)</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Volume Chart -->
                  <div>
                    <h3 class="text-sm font-medium mb-2">Monthly Volume</h3>
                    <div class="h-[300px] bg-muted/30 rounded-lg flex items-center justify-center">
                      <div class="flex flex-col items-center space-y-2">
                        <BarChart3 class="h-8 w-8 text-muted-foreground" />
                        <p class="text-muted-foreground">Volume Trend Chart (6 Months)</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Performance Metrics -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="p-4 border rounded-lg">
                    <h3 class="text-sm font-medium mb-2">Average Transaction Size</h3>
                    <p class="text-2xl font-bold">{{ formatCurrency(totalVolume / (totalTransactions || 1)) }}</p>
                  </div>
                  
                  <div class="p-4 border rounded-lg">
                    <h3 class="text-sm font-medium mb-2">Profit per Trade</h3>
                    <p class="text-2xl font-bold">{{ formatCurrency(totalProfit / (totalTrades || 1)) }}</p>
                  </div>
                  
                  <div class="p-4 border rounded-lg">
                    <h3 class="text-sm font-medium mb-2">Trades per Transaction</h3>
                    <p class="text-2xl font-bold">{{ (totalTrades / (totalTransactions || 1)).toFixed(2) }}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="profit" class="mt-0">
              <div class="h-[400px] bg-muted/30 rounded-lg flex items-center justify-center">
                <div class="flex flex-col items-center space-y-2">
                  <LineChart class="h-8 w-8 text-muted-foreground" />
                  <p class="text-muted-foreground">Detailed Profit Analysis Chart</p>
                </div>
              </div>
              
              <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="p-4 border rounded-lg">
                  <h3 class="text-sm font-medium mb-2">Profit by Asset Type</h3>
                  <div class="h-[200px] flex items-center justify-center">
                    <PieChart class="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>
                
                <div class="p-4 border rounded-lg">
                  <h3 class="text-sm font-medium mb-2">Profit Analysis</h3>
                  <p class="text-muted-foreground mb-4">
                    Trading profitability has shown a steady increase over the past 6 months,
                    with an average monthly growth rate of 15%. XRP trades have been the most profitable,
                    constituting 65% of total profits.
                  </p>
                  <div class="space-y-2">
                    <div class="flex justify-between items-center">
                      <span class="text-sm">XRP</span>
                      <span class="text-sm font-medium">65%</span>
                    </div>
                    <div class="w-full bg-muted rounded-full h-2.5">
                      <div class="bg-blue-500 h-2.5 rounded-full" style="width: 65%"></div>
                    </div>
                    
                    <div class="flex justify-between items-center">
                      <span class="text-sm">XAH</span>
                      <span class="text-sm font-medium">35%</span>
                    </div>
                    <div class="w-full bg-muted rounded-full h-2.5">
                      <div class="bg-purple-500 h-2.5 rounded-full" style="width: 35%"></div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="volume" class="mt-0">
              <div class="h-[400px] bg-muted/30 rounded-lg flex items-center justify-center">
                <div class="flex flex-col items-center space-y-2">
                  <BarChart3 class="h-8 w-8 text-muted-foreground" />
                  <p class="text-muted-foreground">Detailed Volume Analysis Chart</p>
                </div>
              </div>
              
              <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="p-4 border rounded-lg">
                  <h3 class="text-sm font-medium mb-2">Volume Distribution</h3>
                  <div class="h-[200px] flex items-center justify-center">
                    <PieChart class="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>
                
                <div class="p-4 border rounded-lg">
                  <h3 class="text-sm font-medium mb-2">Volume Analysis</h3>
                  <p class="text-muted-foreground mb-4">
                    Trading volume has increased significantly over the past 6 months,
                    with a peak in the most recent month. The XAH/XRP trading pair accounts for
                    the highest portion of trading volume.
                  </p>
                  <div class="space-y-2">
                    <div class="flex justify-between items-center">
                      <span class="text-sm">XAH/XRP</span>
                      <span class="text-sm font-medium">70%</span>
                    </div>
                    <div class="w-full bg-muted rounded-full h-2.5">
                      <div class="bg-green-500 h-2.5 rounded-full" style="width: 70%"></div>
                    </div>
                    
                    <div class="flex justify-between items-center">
                      <span class="text-sm">Other Pairs</span>
                      <span class="text-sm font-medium">30%</span>
                    </div>
                    <div class="w-full bg-muted rounded-full h-2.5">
                      <div class="bg-amber-500 h-2.5 rounded-full" style="width: 30%"></div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  </div>
</template> 