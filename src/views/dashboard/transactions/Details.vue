<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTransactionsStore, TransactionStatus, ProfitStatus } from '@/stores/transactions';
import { useTradesStore } from '@/stores/trades';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, RefreshCcw, CheckCircle2, AlertTriangle, Clock } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const transactionsStore = useTransactionsStore();
const tradesStore = useTradesStore();
const loading = ref(true);
const txid = computed(() => route.params.id as string);

onMounted(async () => {
  try {
    loading.value = true;
    await Promise.all([
      transactionsStore.fetchTransactions(),
      tradesStore.fetchTrades()
    ]);
    
    await transactionsStore.getTransactionDetails(txid.value);
    
    if (!transactionsStore.selectedTransaction) {
      router.push('/dashboard/transactions');
    }
  } catch (error) {
    console.error('Error loading transaction details:', error);
  } finally {
    loading.value = false;
  }
});

const transaction = computed(() => transactionsStore.selectedTransaction);

const relatedTrades = computed(() => {
  if (!transaction.value) return [];
  return tradesStore.trades.filter(trade => 
    trade.relatedTransaction === transaction.value?.utid
  );
});

const getStatusIcon = (status: TransactionStatus) => {
  switch (status) {
    case TransactionStatus.COMPLETED:
      return CheckCircle2;
    case TransactionStatus.FAILED:
      return AlertTriangle;
    default:
      return Clock;
  }
};

const getStatusColor = (status: TransactionStatus) => {
  switch (status) {
    case TransactionStatus.COMPLETED:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case TransactionStatus.FAILED:
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case TransactionStatus.INITIATED:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case TransactionStatus.PROCESSING:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case TransactionStatus.ISSUED:
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

const getProfitStatusColor = (status: ProfitStatus) => {
  switch (status) {
    case ProfitStatus.REALIZED:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case ProfitStatus.LOST:
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
  }
};

const navigateToTrade = (id: string) => {
  router.push(`/dashboard/trades/${id}`);
};
</script>

<template>
  <div>
    <div class="flex items-center mb-6">
      <Button variant="ghost" class="mr-2" @click="router.push('/dashboard/transactions')">
        <ArrowLeft class="h-4 w-4 mr-2" />
        Back to Transactions
      </Button>
      <h1 class="text-2xl font-bold">Transaction Details</h1>
    </div>
    
    <div v-if="loading" class="flex justify-center items-center h-[400px]">
      <div class="animate-spin">
        <RefreshCcw class="h-8 w-8 text-muted-foreground" />
      </div>
    </div>
    
    <div v-else-if="transaction">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Transaction Summary -->
        <Card class="lg:col-span-2">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <component :is="getStatusIcon(transaction.status)" 
                      class="h-5 w-5" 
                      :class="{
                        'text-green-500': transaction.status === TransactionStatus.COMPLETED,
                        'text-red-500': transaction.status === TransactionStatus.FAILED,
                        'text-yellow-500': transaction.status !== TransactionStatus.COMPLETED && transaction.status !== TransactionStatus.FAILED
                      }" />
              Transaction {{ transaction.utid }}
            </CardTitle>
            <CardDescription>
              Created on {{ new Date(transaction.timestamp).toLocaleString() }}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 class="text-sm font-medium text-muted-foreground mb-1">XRP Amount</h3>
                <p class="text-xl font-semibold">{{ transaction.xrpAmount }} XRP</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-muted-foreground mb-1">XAH Amount</h3>
                <p class="text-xl font-semibold">{{ transaction.xahAmount }} XAH</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-muted-foreground mb-1">Exchange Rate</h3>
                <p class="text-xl font-semibold">
                  {{ (Number(transaction.xahAmount) / Number(transaction.xrpAmount)).toFixed(4) }} XAH/XRP
                </p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-muted-foreground mb-1">Profitability</h3>
                <p class="text-xl font-semibold" :class="transaction.profitability ? 'text-green-500' : 'text-muted-foreground'">
                  {{ transaction.profitability 
                    ? new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2 }).format(transaction.profitability) 
                    : 'Pending' }}
                </p>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 class="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                <Badge :class="getStatusColor(transaction.status)" class="text-sm">
                  {{ transaction.status }}
                </Badge>
              </div>
              <div>
                <h3 class="text-sm font-medium text-muted-foreground mb-1">Profit Status</h3>
                <Badge :class="getProfitStatusColor(transaction.profitStatus)" class="text-sm">
                  {{ transaction.profitStatus }}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <!-- Transaction Details -->
        <Card>
          <CardHeader>
            <CardTitle>Transaction Hashes</CardTitle>
            <CardDescription>Blockchain records</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div>
              <h3 class="text-sm font-medium text-muted-foreground mb-1">XRP Transaction</h3>
              <div class="flex items-center gap-2">
                <code class="bg-muted px-2 py-1 rounded text-xs overflow-hidden text-ellipsis">
                  {{ transaction.xrpTxHash }}
                </code>
                <Button variant="ghost" size="icon" class="h-6 w-6" title="View on explorer">
                  <ExternalLink class="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <h3 class="text-sm font-medium text-muted-foreground mb-1">XAH Transaction</h3>
              <div class="flex items-center gap-2">
                <code class="bg-muted px-2 py-1 rounded text-xs overflow-hidden text-ellipsis">
                  {{ transaction.xahTxHash }}
                </code>
                <Button variant="ghost" size="icon" class="h-6 w-6" title="View on explorer">
                  <ExternalLink class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <!-- Related Trades -->
      <Card class="mt-6">
        <CardHeader>
          <CardTitle>Related Trades</CardTitle>
          <CardDescription>Trades executed for this transaction</CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="relatedTrades.length === 0" class="py-8 text-center text-muted-foreground">
            No trades have been executed for this transaction yet.
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-3 px-4 font-medium">Trade ID</th>
                  <th class="text-left py-3 px-4 font-medium">Type</th>
                  <th class="text-left py-3 px-4 font-medium">Asset</th>
                  <th class="text-left py-3 px-4 font-medium">Amount</th>
                  <th class="text-left py-3 px-4 font-medium">Price</th>
                  <th class="text-left py-3 px-4 font-medium">Status</th>
                  <th class="text-right py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="trade in relatedTrades" :key="trade.id" class="border-b hover:bg-muted/50">
                  <td class="py-3 px-4 font-mono text-sm">{{ trade.id }}</td>
                  <td class="py-3 px-4" :class="trade.type === 'SELL' ? 'text-red-500' : 'text-green-500'">{{ trade.type }}</td>
                  <td class="py-3 px-4">{{ trade.asset }}</td>
                  <td class="py-3 px-4">{{ trade.amount }}</td>
                  <td class="py-3 px-4">{{ trade.price }}</td>
                  <td class="py-3 px-4">
                    <Badge variant="outline">{{ trade.status }}</Badge>
                  </td>
                  <td class="py-3 px-4 text-right">
                    <Button size="sm" variant="ghost" @click="navigateToTrade(trade.id)">View</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
    
    <div v-else class="flex flex-col items-center justify-center h-[400px]">
    c
      <AlertTriangle class="h-16 w-16 text-yellow-500 mb-4" />
      <h2 class="text-xl font-bold mb-2">Transaction Not Found</h2>
      <p class="text-muted-foreground mb-4">The requested transaction could not be found.</p>
      <Button @click="router.push('/dashboard/transactions')">Return to Transactions</Button>
    </div>
  </div>
</template> 