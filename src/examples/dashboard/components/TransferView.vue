<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Transfer, TransferStatus } from '@/extracted-app/types'

// Mock data for transfers
const transfers = ref<Transfer[]>([
  {
    id: 'TF123456',
    CreatedTimestamp: '2023-03-15T14:35:00Z',
    CompletedTimestamp: '2023-03-15T14:40:00Z',
    FromAccount: 'Exchange-1',
    to_acc: 'Cold-Storage-1',
    amount: '1000',
    currency: 'XRP',
    payload: '',
    expires_by: '2023-03-15T15:35:00Z',
    status: 'complete',
    active: false,
    LookupHash: '0xabcdef1234567890'
  },
  {
    id: 'TF123457',
    CreatedTimestamp: '2023-03-15T16:35:00Z',
    CompletedTimestamp: '',
    FromAccount: 'Exchange-2',
    to_acc: 'Service-1',
    amount: '5000',
    currency: 'XAH',
    payload: '',
    expires_by: '2023-03-15T17:35:00Z',
    status: 'processing',
    active: true,
    LookupHash: '0xbcdef1234567890a'
  },
  {
    id: 'TF123458',
    CreatedTimestamp: '2023-03-15T17:35:00Z',
    CompletedTimestamp: '',
    FromAccount: 'Service-1',
    to_acc: 'Exchange-1',
    amount: '2000',
    currency: 'XRP',
    payload: '',
    expires_by: '2023-03-15T18:35:00Z',
    status: 'pending_sig',
    active: true,
    LookupHash: '0xcdef1234567890ab'
  }
])

// Format date
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString()
}

// Format status with color
const getStatusClass = (status: string) => {
  switch (status) {
    case 'complete':
      return 'text-green-600'
    case 'processing':
      return 'text-blue-600'
    case 'pending_sig':
      return 'text-yellow-600'
    case 'rejected':
    case 'expired':
      return 'text-red-600'
    default:
      return ''
  }
}

// View transfer details
const viewTransfer = (transfer: Transfer) => {
  console.log('View transfer:', transfer)
  // Implement view logic
}

// Approve transfer
const approveTransfer = (transfer: Transfer) => {
  console.log('Approve transfer:', transfer)
  // Implement approve logic
}

// Reject transfer
const rejectTransfer = (transfer: Transfer) => {
  console.log('Reject transfer:', transfer)
  // Implement reject logic
}

// New transfer form
const newTransfer = ref({
  fromAccount: '',
  toAccount: '',
  amount: '',
  currency: 'XRP'
})

// Available accounts
const accounts = [
  { id: 'Exchange-1', name: 'Exchange 1', type: 'exchange' },
  { id: 'Exchange-2', name: 'Exchange 2', type: 'exchange' },
  { id: 'Service-1', name: 'Service 1', type: 'service' },
  { id: 'Cold-Storage-1', name: 'Cold Storage 1', type: 'cold' }
]

// Available currencies
const currencies = ['XRP', 'XAH']

// Create new transfer
const createTransfer = () => {
  console.log('Create transfer:', newTransfer.value)
  // Implement create logic
}
</script>

<template>
  <div class="space-y-6">
    <!-- New Transfer Form -->
    <div class="grid gap-4 md:grid-cols-2">
      <div class="space-y-4">
        <h3 class="text-lg font-medium">Create New Transfer</h3>
        
        <div class="space-y-2">
          <Label for="fromAccount">From Account</Label>
          <Select v-model="newTransfer.fromAccount">
            <SelectTrigger id="fromAccount">
              <SelectValue placeholder="Select source account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="account in accounts" :key="account.id" :value="account.id">
                {{ account.name }} ({{ account.type }})
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div class="space-y-2">
          <Label for="toAccount">To Account</Label>
          <Select v-model="newTransfer.toAccount">
            <SelectTrigger id="toAccount">
              <SelectValue placeholder="Select destination account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="account in accounts" :key="account.id" :value="account.id">
                {{ account.name }} ({{ account.type }})
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div class="space-y-2">
          <Label for="amount">Amount</Label>
          <Input id="amount" v-model="newTransfer.amount" type="number" placeholder="Enter amount" />
        </div>
        
        <div class="space-y-2">
          <Label for="currency">Currency</Label>
          <Select v-model="newTransfer.currency">
            <SelectTrigger id="currency">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="currency in currencies" :key="currency" :value="currency">
                {{ currency }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button @click="createTransfer">Create Transfer</Button>
      </div>
      
      <div class="space-y-4">
        <h3 class="text-lg font-medium">Transfer Information</h3>
        <p>
          Transfers allow you to move assets between different accounts in the system. 
          Each transfer requires approval from authorized signers before execution.
        </p>
        <p>
          <strong>Exchange accounts</strong> are connected to trading platforms.
          <br>
          <strong>Service accounts</strong> are used for customer-facing operations.
          <br>
          <strong>Cold storage</strong> accounts are used for secure long-term storage.
        </p>
        <p>
          Transfers may require multiple signatures depending on the amount and accounts involved.
        </p>
      </div>
    </div>

    <!-- Recent Transfers -->
    <div>
      <h3 class="text-lg font-medium mb-4">Recent Transfers</h3>
      <Table>
        <TableCaption>A list of recent transfers.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Completed</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="transfer in transfers" :key="transfer.id">
            <TableCell>{{ transfer.id }}</TableCell>
            <TableCell :class="getStatusClass(transfer.status)">
              {{ transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1) }}
            </TableCell>
            <TableCell>{{ transfer.FromAccount }}</TableCell>
            <TableCell>{{ transfer.to_acc }}</TableCell>
            <TableCell>{{ transfer.amount }}</TableCell>
            <TableCell>{{ transfer.currency }}</TableCell>
            <TableCell>{{ formatDate(transfer.CreatedTimestamp) }}</TableCell>
            <TableCell>{{ formatDate(transfer.CompletedTimestamp) }}</TableCell>
            <TableCell>
              <div class="flex space-x-2">
                <Button variant="outline" size="sm" @click="viewTransfer(transfer)">View</Button>
                <Button v-if="transfer.status === 'pending_sig'" variant="default" size="sm" @click="approveTransfer(transfer)">Approve</Button>
                <Button v-if="transfer.status === 'pending_sig'" variant="destructive" size="sm" @click="rejectTransfer(transfer)">Reject</Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>