<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useTransactionsStore, TransactionStatus } from '@/stores/transactions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useRouter } from 'vue-router';
import { Search, Calendar as CalendarIcon, XCircle, RefreshCcw } from 'lucide-vue-next';

const transactionsStore = useTransactionsStore();
const router = useRouter();
const searchQuery = ref('');
const loading = ref(true);
const dateFrom = ref();
const dateTo = ref();
const selectedStatus = ref<TransactionStatus | null>(null);

onMounted(async () => {
  try {
    loading.value = true;
    await transactionsStore.fetchTransactions();
  } catch (error) {
    console.error('Error fetching transactions:', error);
  } finally {
    loading.value = false;
  }
});

const filteredTransactions = computed(() => {
  let result = transactionsStore.filteredTransactions;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(tx => 
      tx.utid.toLowerCase().includes(query) || 
      tx.xrpTxHash.toLowerCase().includes(query) || 
      tx.xahTxHash.toLowerCase().includes(query)
    );
  }
  
  return result;
});

const resetFilters = () => {
  searchQuery.value = '';
  dateFrom.value = undefined;
  dateTo.value = undefined;
  selectedStatus.value = null;
  transactionsStore.clearFilters();
};

const applyStatusFilter = (status: TransactionStatus | null) => {
  selectedStatus.value = status;
  transactionsStore.updateFilters({ status });
};

const applyDateFilter = () => {
  const fromDate = dateFrom.value ? new Date(dateFrom.value).toISOString() : null;
  const toDate = dateTo.value ? new Date(dateTo.value).toISOString() : null;
  
  transactionsStore.updateFilters({
    fromDate,
    toDate
  });
};

const navigateToDetails = (utid: string) => {
  router.push(`/dashboard/transactions/${utid}`);
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

// Simple format function for dates
const formatDate = (date: Date, pattern: string) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Transactions</h1>
      
      <div class="flex gap-2">
        <Button variant="outline" size="sm" @click="resetFilters">
          <XCircle class="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      </div>
    </div>
    
    <!-- Filter controls -->
    <Card class="mb-6">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
        <CardDescription>Filter transactions by various criteria</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div>
            <label class="text-sm mb-1 block">Search</label>
            <div class="relative">
              <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                v-model="searchQuery"
                class="pl-8"
                placeholder="Transaction ID, Hash..."
              />
            </div>
          </div>
          
          <!-- Status filter -->
          <div>
            <label class="text-sm mb-1 block">Status</label>
            <Select v-model="selectedStatus" @update:model-value="applyStatusFilter">
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="null">All statuses</SelectItem>
                <SelectItem :value="TransactionStatus.INITIATED">Initiated</SelectItem>
                <SelectItem :value="TransactionStatus.PROCESSING">Processing</SelectItem>
                <SelectItem :value="TransactionStatus.ISSUED">Issued</SelectItem>
                <SelectItem :value="TransactionStatus.COMPLETED">Completed</SelectItem>
                <SelectItem :value="TransactionStatus.FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <!-- Date from -->
          <div>
            <label class="text-sm mb-1 block">From Date</label>
            <Popover>
              <PopoverTrigger as-child>
                <Button variant="outline" class="w-full justify-start text-left font-normal">
                  <CalendarIcon class="mr-2 h-4 w-4" />
                  {{ dateFrom ? formatDate(dateFrom, 'PPP') : 'Pick a date' }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0">
                <Calendar v-model="dateFrom" @update:model-value="applyDateFilter" />
              </PopoverContent>
            </Popover>
          </div>
          
          <!-- Date to -->
          <div>
            <label class="text-sm mb-1 block">To Date</label>
            <Popover>
              <PopoverTrigger as-child>
                <Button variant="outline" class="w-full justify-start text-left font-normal">
                  <CalendarIcon class="mr-2 h-4 w-4" />
                  {{ dateTo ? formatDate(dateTo, 'PPP') : 'Pick a date' }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0">
                <Calendar v-model="dateTo" @update:model-value="applyDateFilter" />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center h-[400px]">
      <div class="animate-spin">
        <RefreshCcw class="h-8 w-8 text-muted-foreground" />
      </div>
    </div>
    
    <!-- Results -->
    <Card v-else>
      <CardHeader>
        <CardTitle>Transaction Results</CardTitle>
        <CardDescription>
          Showing {{ filteredTransactions.length }} of {{ transactionsStore.transactions.length }} transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4 font-medium">Transaction ID</th>
                <th class="text-left py-3 px-4 font-medium">Date</th>
                <th class="text-left py-3 px-4 font-medium">XRP Amount</th>
                <th class="text-left py-3 px-4 font-medium">XAH Amount</th>
                <th class="text-left py-3 px-4 font-medium">Status</th>
                <th class="text-left py-3 px-4 font-medium">Profit Status</th>
                <th class="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tx in filteredTransactions" :key="tx.utid" class="border-b hover:bg-muted/50 cursor-pointer" @click="navigateToDetails(tx.utid)">
                <td class="py-3 px-4 font-mono text-sm">{{ tx.utid }}</td>
                <td class="py-3 px-4">{{ new Date(tx.timestamp).toLocaleString() }}</td>
                <td class="py-3 px-4">{{ tx.xrpAmount }}</td>
                <td class="py-3 px-4">{{ tx.xahAmount }}</td>
                <td class="py-3 px-4">
                  <Badge :class="getStatusColor(tx.status)">{{ tx.status }}</Badge>
                </td>
                <td class="py-3 px-4">
                  <Badge variant="outline">{{ tx.profitStatus }}</Badge>
                </td>
                <td class="py-3 px-4 text-right">
                  <Button size="sm" variant="ghost" @click.stop="navigateToDetails(tx.utid)">View</Button>
                </td>
              </tr>
              
              <tr v-if="filteredTransactions.length === 0">
                <td colspan="7" class="py-10 text-center text-muted-foreground">
                  No transactions found matching your filters.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
</template> 