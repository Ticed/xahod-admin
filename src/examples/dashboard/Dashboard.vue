<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import DateRangePicker from './components/DateRangePicker.vue'
import MainNav from './components/MainNav.vue'
import Overview from './components/Overview.vue'
import RecentSales from './components/RecentSales.vue'
import TransactionsTable from './components/TransactionsTable.vue'
import TradingView from './components/TradingView.vue'
import TransferView from './components/TransferView.vue'

import Search from './components/Search.vue'
import TeamSwitcher from './components/TeamSwitcher.vue'
import UserNav from './components/UserNav.vue'
</script>

<template>
  <div class="md:hidden">
    <div class="p-4 text-center">
      <h2 class="text-2xl font-bold">Xahod HQ Dashboard</h2>
      <p class="text-muted-foreground">Please view on a larger screen for the full dashboard experience.</p>
    </div>
  </div>

  <div class="hidden flex-col md:flex">
    <div class="border-b">
      <div class="flex h-16 items-center px-4">
        <TeamSwitcher />
        <MainNav class="mx-6" />
        <div class="ml-auto flex items-center space-x-4">
          <Search />
          <UserNav />
        </div>
      </div>
    </div>
    <div class="flex-1 space-y-4 p-8 pt-6">
      <div class="flex items-center justify-between space-y-2">
        <h2 class="text-3xl font-bold tracking-tight">
          Dashboard
        </h2>
        <div class="flex items-center space-x-2">
          <DateRangePicker />
          <Button>Download</Button>
        </div>
      </div>
      <Tabs default-value="dashboard" class="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="transactions">
            Transactions
          </TabsTrigger>
          <TabsTrigger value="trading">
            Trading
          </TabsTrigger>
          <TabsTrigger value="transfer">
            Transfer
          </TabsTrigger>
          <TabsTrigger value="control-panel">
            Control Panel
          </TabsTrigger>
          <TabsTrigger value="settings">
            Settings
          </TabsTrigger>
          <TabsTrigger value="tech/events">
            Tech Events
          </TabsTrigger>
          <TabsTrigger value="tech/accounts">
            Tech Accounts
          </TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" class="space-y-4">
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium">
                  XRP/USDT Price
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  class="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold">
                  $0.5423
                </div>
                <p class="text-xs text-muted-foreground">
                  +2.1% from last hour
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium">
                  XAH/USDT Price
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  class="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold">
                  $0.0321
                </div>
                <p class="text-xs text-muted-foreground">
                  -0.5% from last hour
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium">
                  XAH/XRP Rate
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  class="h-4 w-4 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold">
                  0.0592
                </div>
                <p class="text-xs text-muted-foreground">
                  +1.2% from last hour
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium">
                  Active Transactions
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  class="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold">
                  12
                </div>
                <p class="text-xs text-muted-foreground">
                  +3 since last hour
                </p>
              </CardContent>
            </Card>
          </div>
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card class="col-span-4">
              <CardHeader>
                <CardTitle>Market Overview</CardTitle>
              </CardHeader>
              <CardContent class="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card class="col-span-3">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  You have 12 active transactions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="transactions" class="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>
                View and manage all customer transactions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionsTable />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trading" class="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trading</CardTitle>
              <CardDescription>
                Manage trading operations and view history.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TradingView />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="transfer" class="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transfer</CardTitle>
              <CardDescription>
                Manage asset transfers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TransferView />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="control-panel" class="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Control Panel</CardTitle>
              <CardDescription>
                System control and configuration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Control panel interface will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings" class="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Manage application settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Settings interface will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tech/events" class="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tech Events</CardTitle>
              <CardDescription>
                View trade events history.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Tech events interface will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tech/accounts" class="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tech Accounts</CardTitle>
              <CardDescription>
                Manage system accounts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Account management interface will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
