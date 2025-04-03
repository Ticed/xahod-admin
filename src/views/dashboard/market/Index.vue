<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMarketStore } from '@/stores/market';
import { RefreshCcw, DollarSign, TrendingUp, TrendingDown } from 'lucide-vue-next';

const marketStore = useMarketStore();
const loading = ref(true);
const activeTab = ref('overview');

onMounted(async () => {
  try {
    loading.value = true;
    await marketStore.fetchMarketData();
  } catch (error) {
    console.error('Error loading market data:', error);
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

const formatPercent = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Market Overview</h1>
      
      <div class="flex gap-2">
        <button class="flex items-center text-sm text-muted-foreground hover:text-foreground" @click="marketStore.fetchMarketData()">
          <RefreshCcw class="h-4 w-4 mr-1" />
          Refresh
        </button>
      </div>
    </div>
    
    <div v-if="loading" class="flex justify-center items-center h-[400px]">
      <div class="animate-spin">
        <RefreshCcw class="h-8 w-8 text-muted-foreground" />
      </div>
    </div>
    
    <div v-else>
      <!-- Market Rate Cards -->
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
            <p class="text-xs text-muted-foreground mt-1">
              24h change: <span class="text-green-500">+2.5%</span>
            </p>
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
            <p class="text-xs text-muted-foreground mt-1">
              24h change: <span class="text-red-500">-1.2%</span>
            </p>
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
                <DollarSign class="h-4 w-4 text-blue-500" />
              </div>
            </div>
            <p class="text-xs text-muted-foreground mt-1">
              Current floating rate
            </p>
          </CardContent>
        </Card>
      </div>
      
      <!-- Market Chart Tabs -->
      <Card>
        <CardHeader>
          <CardTitle>Market Analysis</CardTitle>
          <CardDescription>Price charts and market performance</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" class="w-full" v-model="activeTab">
            <TabsList class="grid grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="xrp">XRP Chart</TabsTrigger>
              <TabsTrigger value="xah">XAH Chart</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" class="mt-0">
              <div class="flex flex-col space-y-4">
                <div class="h-[400px] bg-muted/30 rounded-lg flex items-center justify-center">
                  <p class="text-muted-foreground">Market Overview Chart (24h)</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="p-4 border rounded-lg">
                    <h3 class="text-sm font-medium mb-2">24h Trading Volume</h3>
                    <p class="text-2xl font-bold">{{ formatCurrency(marketStore.volume24h) }}</p>
                  </div>
                  
                  <div class="p-4 border rounded-lg">
                    <h3 class="text-sm font-medium mb-2">Trade Count</h3>
                    <p class="text-2xl font-bold">{{ marketStore.trades24h }}</p>
                  </div>
                  
                  <div class="p-4 border rounded-lg">
                    <h3 class="text-sm font-medium mb-2">Profitability</h3>
                    <p class="text-2xl font-bold text-green-500">{{ formatPercent(marketStore.profitability) }}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="xrp" class="mt-0">
              <div class="h-[400px] bg-muted/30 rounded-lg flex items-center justify-center">
                <p class="text-muted-foreground">XRP Price Chart (24h)</p>
              </div>
              
              <div class="mt-4 p-4 border rounded-lg">
                <h3 class="text-sm font-medium mb-2">XRP Market Analysis</h3>
                <p class="text-muted-foreground">
                  XRP has shown stability over the past 24 hours with minor fluctuations.
                  The current price is {{ formatCurrency(marketStore.xrpPrice) }} with a
                  positive trend expected to continue in the short term.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="xah" class="mt-0">
              <div class="h-[400px] bg-muted/30 rounded-lg flex items-center justify-center">
                <p class="text-muted-foreground">XAH Price Chart (24h)</p>
              </div>
              
              <div class="mt-4 p-4 border rounded-lg">
                <h3 class="text-sm font-medium mb-2">XAH Market Analysis</h3>
                <p class="text-muted-foreground">
                  XAH has experienced a slight decrease over the past 24 hours.
                  The current price is {{ formatCurrency(marketStore.xahPrice) }} with
                  potential for recovery based on historical patterns.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <!-- Historical Rate Table -->
      <Card class="mt-6">
        <CardHeader>
          <CardTitle>Historical Data</CardTitle>
          <CardDescription>Last 24 hours price data</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-3 px-4 font-medium">Time</th>
                  <th class="text-left py-3 px-4 font-medium">XRP Price</th>
                  <th class="text-left py-3 px-4 font-medium">XAH Price</th>
                  <th class="text-left py-3 px-4 font-medium">XAH/XRP Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(data, index) in marketStore.historicalData.slice(0, 10)" :key="index" class="border-b">
                  <td class="py-3 px-4">{{ new Date(data.timestamp).toLocaleTimeString() }}</td>
                  <td class="py-3 px-4">{{ formatCurrency(data.xrpPrice) }}</td>
                  <td class="py-3 px-4">{{ formatCurrency(data.xahPrice) }}</td>
                  <td class="py-3 px-4">{{ data.floatingRate.toFixed(4) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template> 