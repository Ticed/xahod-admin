<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useTradesStore, TradeStatus, TradeType } from '@/stores/trades';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useRouter } from 'vue-router';
import { Search, Calendar as CalendarIcon, XCircle, RefreshCcw } from 'lucide-vue-next';

const tradesStore = useTradesStore();
const router = useRouter();
const searchQuery = ref('');
const loading = ref(true);
const dateFrom = ref();
const dateTo = ref();
const selectedStatus = ref<TradeStatus | null>(null);
const selectedType = ref<TradeType | null>(null);

onMounted(async () => {
  try {
    loading.value = true;
    await tradesStore.fetchTrades();
  } catch (error) {
    console.error('Error fetching trades:', error);
  } finally {
    loading.value = false;
  }
});

const filteredTrades = computed(() => {
  let result = tradesStore.filteredTrades;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(trade => 
      trade.id.toLowerCase().includes(query) || 
      trade.relatedTransaction.toLowerCase().includes(query)
    );
  }
  
  return result;
});

const resetFilters = () => {
  searchQuery.value = '';
  dateFrom.value = undefined;
  dateTo.value = undefined;
  selectedStatus.value = null;
  selectedType.value = null;
  tradesStore.clearFilters();
};

const applyStatusFilter = (status: TradeStatus | null) => {
  selectedStatus.value = status;
  tradesStore.updateFilters({ status });
};

const applyTypeFilter = (type: TradeType | null) => {
  selectedType.value = type;
  tradesStore.updateFilters({ type });
};

const applyDateFilter = () => {
  const fromDate = dateFrom.value ? new Date(dateFrom.value).toISOString() : null;
  const toDate = dateTo.value ? new Date(dateTo.value).toISOString() : null;
  
  tradesStore.updateFilters({
    fromDate,
    toDate
  });
};

const navigateToDetails = (id: string) => {
  router.push(`/dashboard/trades/${id}`);
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

// Simple format function for dates
const formatDate = (date: Date, pattern: string) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Trades</h1>
      
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
        <CardDescription>Filter trades by various criteria</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <!-- Search -->
          <div>
            <label class="text-sm mb-1 block">Search</label>
            <div class="relative">
              <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                v-model="searchQuery"
                class="pl-8"
                placeholder="Trade ID, Transaction ID..."
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
                <SelectItem :value="TradeStatus.PENDING">Pending</SelectItem>
                <SelectItem :value="TradeStatus.COMPLETED">Completed</SelectItem>
                <SelectItem :value="TradeStatus.FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <!-- Type filter -->
          <div>
            <label class="text-sm mb-1 block">Type</label>
            <Select v-model="selectedType" @update:model-value="applyTypeFilter">
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="null">All types</SelectItem>
                <SelectItem :value="TradeType.BUY">Buy</SelectItem>
                <SelectItem :value="TradeType.SELL">Sell</SelectItem>
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
        <CardTitle>Trade Results</CardTitle>
        <CardDescription>
          Showing {{ filteredTrades.length }} of {{ tradesStore.trades.length }} trades
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4 font-medium">Trade ID</th>
                <th class="text-left py-3 px-4 font-medium">Date</th>
                <th class="text-left py-3 px-4 font-medium">Type</th>
                <th class="text-left py-3 px-4 font-medium">Asset</th>
                <th class="text-left py-3 px-4 font-medium">Amount</th>
                <th class="text-left py-3 px-4 font-medium">Price</th>
                <th class="text-left py-3 px-4 font-medium">Status</th>
                <th class="text-left py-3 px-4 font-medium">Transaction</th>
                <th class="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="trade in filteredTrades" :key="trade.id" class="border-b hover:bg-muted/50 cursor-pointer" @click="navigateToDetails(trade.id)">
                <td class="py-3 px-4 font-mono text-sm">{{ trade.id }}</td>
                <td class="py-3 px-4">{{ new Date(trade.timestamp).toLocaleString() }}</td>
                <td class="py-3 px-4" :class="trade.type === 'SELL' ? 'text-red-500' : 'text-green-500'">
                  {{ trade.type }}
                </td>
                <td class="py-3 px-4">{{ trade.asset }}</td>
                <td class="py-3 px-4">{{ trade.amount }}</td>
                <td class="py-3 px-4">{{ trade.price }}</td>
                <td class="py-3 px-4">
                  <Badge :class="getStatusColor(trade.status)">{{ trade.status }}</Badge>
                </td>
                <td class="py-3 px-4 font-mono text-xs">{{ trade.relatedTransaction }}</td>
                <td class="py-3 px-4 text-right">
                  <Button size="sm" variant="ghost" @click.stop="navigateToDetails(trade.id)">View</Button>
                </td>
              </tr>
              
              <tr v-if="filteredTrades.length === 0">
                <td colspan="9" class="py-10 text-center text-muted-foreground">
                  No trades found matching your filters.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
</template> 