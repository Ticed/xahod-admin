<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTradesStore, TradeStatus, TradeType } from '@/stores/trades';
import { useTransactionsStore } from '@/stores/transactions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, RefreshCcw, CheckCircle2, AlertTriangle, Clock } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const tradesStore = useTradesStore();
const transactionsStore = useTransactionsStore();
const loading = ref(true);
const tradeId = computed(() => route.params.id as string);

onMounted(async () => {
  try {
    loading.value = true;
    await Promise.all([
      tradesStore.fetchTrades(),
      transactionsStore.fetchTransactions()
    ]);
    
    await tradesStore.getTradeDetails(tradeId.value);
    
    if (!tradesStore.selectedTrade) {
      router.push('/dashboard/trades');
    }
  } catch (error) {
    console.error('Error loading trade details:', error);
  } finally {
    loading.value = false;
  }
});

const trade = computed(() => tradesStore.selectedTrade);

const relatedTransaction = computed(() => {
  if (!trade.value) return null;
  return transactionsStore.transactions.find(tx => 
    tx.utid === trade.value?.relatedTransaction
  );
});

const getStatusIcon = (status: TradeStatus) => {
  switch (status) {
    case TradeStatus.COMPLETED:
      return CheckCircle2;
    case TradeStatus.FAILED:
      return AlertTriangle;
    default:
      return Clock;
  }
};

const getStatusColor = (status: TradeStatus) => {
  switch (status) {
    case TradeStatus.COMPLETED:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case TradeStatus.FAILED:
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
  }
};

const navigateToTransaction = (utid: string) => {
  router.push(`/dashboard/transactions/${utid}`);
};
</script>

<template>
  <div>
    <div class="flex items-center mb-6">
      <Button variant="ghost" class="mr-2" @click="router.push('/dashboard/trades')">
        <ArrowLeft class="h-4 w-4 mr-2" />
        Back to Trades
      </Button>
      <h1 class="text-2xl font-bold">Trade Details</h1>
    </div>
    
    <div v-if="loading" class="flex justify-center items-center h-[400px]">
      <div class="animate-spin">
        <RefreshCcw class="h-8 w-8 text-muted-foreground" />
      </div>
    </div>
    
    <div v-else-if="trade">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Trade Summary -->
        <Card class="lg:col-span-2">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <component :is="getStatusIcon(trade.status)" 
                      class="h-5 w-5" 
                      :class="{
                        'text-green-500': trade.status === TradeStatus.COMPLETED,
                        'text-red-500': trade.status === TradeStatus.FAILED,
                        'text-yellow-500': trade.status === TradeStatus.PENDING
                      }" />
              Trade {{ trade.id }}
            </CardTitle>
            <CardDescription>
              Executed on {{ new Date(trade.timestamp).toLocaleString() }}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 class="text-sm font-medium text-muted-foreground mb-1">Type</h3>
                <p class="text-xl font-semibold" :class="trade.type === TradeType.SELL ? 'text-red-500' : 'text-green-500'">
                  {{ trade.type }}
                </p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-muted-foreground mb-1">Asset</h3>
                <p class="text-xl font-semibold">{{ trade.asset }}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-muted-foreground mb-1">Amount</h3>
                <p class="text-xl font-semibold">{{ trade.amount }}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-muted-foreground mb-1">Price</h3>
                <p class="text-xl font-semibold">{{ trade.price }}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-muted-foreground mb-1">Total Value</h3>
                <p class="text-xl font-semibold">
                  {{ (Number(trade.amount) * Number(trade.price)).toFixed(6) }} USDT
                </p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-muted-foreground mb-1">Profitability</h3>
                <p class="text-xl font-semibold" :class="trade.profitability ? 'text-green-500' : 'text-muted-foreground'">
                  {{ trade.profitability 
                    ? new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2 }).format(trade.profitability) 
                    : 'N/A' }}
                </p>
              </div>
            </div>
            
            <div>
              <h3 class="text-sm font-medium text-muted-foreground mb-1">Status</h3>
              <Badge :class="getStatusColor(trade.status)" class="text-sm">
                {{ trade.status }}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <!-- Related Transaction -->
        <Card>
          <CardHeader>
            <CardTitle>Related Transaction</CardTitle>
            <CardDescription>Customer exchange details</CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="relatedTransaction">
              <div class="p-4 border rounded">
                <div class="flex justify-between mb-2">
                  <h3 class="font-medium">Transaction ID</h3>
                  <span class="font-mono text-xs">{{ relatedTransaction.utid }}</span>
                </div>
                <div class="text-sm space-y-2">
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">XRP Amount:</span>
                    <span>{{ relatedTransaction.xrpAmount }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">XAH Amount:</span>
                    <span>{{ relatedTransaction.xahAmount }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Status:</span>
                    <span>{{ relatedTransaction.status }}</span>
                  </div>
                </div>
                <div class="mt-4 text-right">
                  <Button size="sm" variant="outline" @click="navigateToTransaction(relatedTransaction.utid)">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
            <div v-else class="py-8 text-center text-muted-foreground">
              No related transaction found.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    
    <div v-else class="flex flex-col items-center justify-center h-[400px]">
      <AlertTriangle class="h-16 w-16 text-yellow-500 mb-4" />
      <h2 class="text-xl font-bold mb-2">Trade Not Found</h2>
      <p class="text-muted-foreground mb-4">The requested trade could not be found.</p>
      <Button @click="router.push('/dashboard/trades')">Return to Trades</Button>
    </div>
  </div>
</template> 