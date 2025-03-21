<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Transaction } from '@/extracted-app/types'

// Mock data for now
const transactions = ref<Transaction[]>([
  {
    utid: 'TX123456',
    status: 'complete',
    raddress: '0x1234567890abcdef',
    amount_xrp: '100.00',
    amount_xah: '1500.00',
    given_rate: '15.00',
    price_market_xrp: '0.5423',
    price_market_xah: '0.0321',
    tx_hash_xrp: '0xabcdef1234567890',
    tx_hash_xah: '0x0987654321fedcba',
    memo_data: 'Customer payment',
    creation_time: '2023-03-15T14:30:00Z',
    notes: '',
    active: false
  },
  {
    utid: 'TX123457',
    status: 'processing',
    raddress: '0x2345678901abcdef',
    amount_xrp: '200.00',
    amount_xah: '3000.00',
    given_rate: '15.00',
    price_market_xrp: '0.5423',
    price_market_xah: '0.0321',
    tx_hash_xrp: '0xbcdef1234567890a',
    tx_hash_xah: '',
    memo_data: 'Customer payment',
    creation_time: '2023-03-15T15:30:00Z',
    notes: 'Waiting for confirmation',
    active: true
  },
  {
    utid: 'TX123458',
    status: 'created',
    raddress: '0x3456789012abcdef',
    amount_xrp: '50.00',
    amount_xah: '750.00',
    given_rate: '15.00',
    price_market_xrp: '0.5423',
    price_market_xah: '0.0321',
    tx_hash_xrp: '0xcdef1234567890ab',
    tx_hash_xah: '',
    memo_data: 'Customer payment',
    creation_time: '2023-03-15T16:30:00Z',
    notes: '',
    active: true
  }
])

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

// Format status with color
const getStatusClass = (status: string) => {
  switch (status) {
    case 'complete':
      return 'text-green-600'
    case 'processing':
      return 'text-blue-600'
    case 'created':
      return 'text-yellow-600'
    case 'failed':
      return 'text-red-600'
    default:
      return ''
  }
}

// Truncate address
const truncateAddress = (address: string) => {
  if (address.length <= 12) return address
  return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`
}

// View transaction details
const viewTransaction = (transaction: Transaction) => {
  console.log('View transaction:', transaction)
  // Implement view logic
}

// Edit transaction
const editTransaction = (transaction: Transaction) => {
  console.log('Edit transaction:', transaction)
  // Implement edit logic
}

// In a real implementation, we would fetch transactions from the API
onMounted(() => {
  // fetchTransactions()
})
</script>

<template>
  <div>
    <Table>
      <TableCaption>A list of recent transactions.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>XRP Amount</TableHead>
          <TableHead>XAH Amount</TableHead>
          <TableHead>Rate</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="transaction in transactions" :key="transaction.utid">
          <TableCell>{{ transaction.utid }}</TableCell>
          <TableCell :class="getStatusClass(transaction.status)">
            {{ transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1) }}
          </TableCell>
          <TableCell>{{ truncateAddress(transaction.raddress) }}</TableCell>
          <TableCell>{{ transaction.amount_xrp }}</TableCell>
          <TableCell>{{ transaction.amount_xah }}</TableCell>
          <TableCell>{{ transaction.given_rate }}</TableCell>
          <TableCell>{{ formatDate(transaction.creation_time) }}</TableCell>
          <TableCell>
            <div class="flex space-x-2">
              <Button variant="outline" size="sm" @click="viewTransaction(transaction)">View</Button>
              <Button variant="outline" size="sm" @click="editTransaction(transaction)">Edit</Button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>