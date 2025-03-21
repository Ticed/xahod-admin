<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Trade } from '@/extracted-app/types'

// Mock data for trades
const trades = ref<Trade[]>([
  {
    utid: 'TX123456',
    id: 1,
    trade_id: 'TR123456',
    trade_type: 'sell',
    status: 'closed',
    creation_time: '2023-03-15T14:35:00Z',
    currency: 'XRP',
    currency_pair: 'XRP/USDT',
    price: 0.5423,
    quantity: 100,
    commission: 0.1,
    platform: 'Binance',
    automated: true,
    notes: ''
  },
  {
    utid: 'TX123457',
    id: 2,
    trade_id: 'TR123457',
    trade_type: 'buy',
    status: 'closed',
    creation_time: '2023-03-15T14:40:00Z',
    currency: 'XAH',
    currency_pair: 'XAH/USDT',
    price: 0.0321,
    quantity: 1500,
    commission: 0.1,
    platform: 'Binance',
    automated: true,
    notes: ''
  },
  {
    utid: 'TX123458',
    id: 3,
    trade_id: 'TR123458',
    trade_type: 'sell',
    status: 'open',
    creation_time: '2023-03-15T16:35:00Z',
    currency: 'XRP',
    currency_pair: 'XRP/USDT',
    price: 0.5423,
    quantity: 50,
    commission: 0.1,
    platform: 'Binance',
    automated: true,
    notes: 'Waiting for execution'
  }
])

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

// Format status with color
const getStatusClass = (status: string) => {
  switch (status) {
    case 'closed':
      return 'text-green-600'
    case 'open':
      return 'text-blue-600'
    default:
      return ''
  }
}

// Format trade type with color
const getTradeTypeClass = (type: string) => {
  switch (type) {
    case 'buy':
      return 'text-green-600'
    case 'sell':
      return 'text-red-600'
    default:
      return ''
  }
}

// View trade details
const viewTrade = (trade: Trade) => {
  console.log('View trade:', trade)
  // Implement view logic
}

// Market metrics
const marketMetrics = ref({
  xrpPrice: 0.5423,
  xahPrice: 0.0321,
  floatingRate: 0.0592,
  volume24h: 1250000,
  trades24h: 156,
  profitability24h: 2.3
})
</script>

<template>
  <div class="space-y-6">
    <!-- Market Metrics -->
    <div class="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Market Metrics</CardTitle>
          <CardDescription>Current market conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span>XRP/USDT:</span>
              <span class="font-medium">${{ marketMetrics.xrpPrice }}</span>
            </div>
            <div class="flex justify-between">
              <span>XAH/USDT:</span>
              <span class="font-medium">${{ marketMetrics.xahPrice }}</span>
            </div>
            <div class="flex justify-between">
              <span>XAH/XRP Rate:</span>
              <span class="font-medium">{{ marketMetrics.floatingRate }}</span>
            </div>
            <div class="flex justify-between">
              <span>24h Volume:</span>
              <span class="font-medium">${{ marketMetrics.volume24h.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between">
              <span>24h Trades:</span>
              <span class="font-medium">{{ marketMetrics.trades24h }}</span>
            </div>
            <div class="flex justify-between">
              <span>24h Profitability:</span>
              <span class="font-medium text-green-600">+{{ marketMetrics.profitability24h }}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="md:col-span-2">
        <CardHeader>
          <CardTitle>Trading Actions</CardTitle>
          <CardDescription>Execute manual trades</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-4">
              <h3 class="text-lg font-medium">Buy/Sell XRP</h3>
              <div class="flex space-x-2">
                <Button variant="default">Buy XRP</Button>
                <Button variant="destructive">Sell XRP</Button>
              </div>
            </div>
            <div class="space-y-4">
              <h3 class="text-lg font-medium">Buy/Sell XAH</h3>
              <div class="flex space-x-2">
                <Button variant="default">Buy XAH</Button>
                <Button variant="destructive">Sell XAH</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Recent Trades -->
    <Card>
      <CardHeader>
        <CardTitle>Recent Trades</CardTitle>
        <CardDescription>History of recent trading operations</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of recent trades.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Pair</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="trade in trades" :key="trade.id">
              <TableCell>{{ trade.trade_id }}</TableCell>
              <TableCell :class="getTradeTypeClass(trade.trade_type)">
                {{ trade.trade_type.charAt(0).toUpperCase() + trade.trade_type.slice(1) }}
              </TableCell>
              <TableCell :class="getStatusClass(trade.status)">
                {{ trade.status.charAt(0).toUpperCase() + trade.status.slice(1) }}
              </TableCell>
              <TableCell>{{ trade.currency }}</TableCell>
              <TableCell>{{ trade.currency_pair }}</TableCell>
              <TableCell>${{ trade.price }}</TableCell>
              <TableCell>{{ trade.quantity }}</TableCell>
              <TableCell>{{ formatDate(trade.creation_time) }}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" @click="viewTrade(trade)">View</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>