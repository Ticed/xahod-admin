<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/registry/new-york/ui/card'
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

import Search from './components/Search.vue'
import TeamSwitcher from './components/TeamSwitcher.vue'
import UserNav from './components/UserNav.vue'
</script>

<template>
  <div class="md:hidden">
    <VPImage
      alt="Dashboard"
      width="1280"
      height="1214" class="block" :image="{
        dark: '/examples/dashboard-dark.png',
        light: '/examples/dashboard-light.png',
      }"
    />
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
          Dashboard Content
        </TabsContent>
        <TabsContent value="transactions" class="space-y-4">
          Transactions Content
        </TabsContent>
        <TabsContent value="trading" class="space-y-4">
          Trading Content
        </TabsContent>
        <TabsContent value="transfer" class="space-y-4">
          Transfer Content
        </TabsContent>
        <TabsContent value="control-panel" class="space-y-4">
          Control Panel Content
        </TabsContent>
        <TabsContent value="settings" class="space-y-4">
          Settings Content
        </TabsContent>
        <TabsContent value="tech/events" class="space-y-4">
          Tech Events Content
        </TabsContent>
        <TabsContent value="tech/accounts" class="space-y-4">
          Tech Accounts Content
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
