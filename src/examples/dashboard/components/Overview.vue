<script setup lang="ts">
// We'll use a simple div for now as we don't have the chart component
// import { BarChart } from '@/components/ui/chart-bar'

const data = [
  { name: 'Jan', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Feb', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Mar', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Apr', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'May', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Jun', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Jul', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Aug', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Sep', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Oct', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Nov', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Dec', total: Math.floor(Math.random() * 5000) + 1000 },
]
</script>

<template>
  <div class="h-[350px] w-full">
    <p class="text-center py-4">Chart will be implemented here</p>
    <div class="flex justify-between">
      <div v-for="(item, index) in data" :key="index" class="flex flex-col items-center">
        <div class="bg-primary h-[100px] w-8" :style="{ height: `${item.total / 50}px` }"></div>
        <span class="text-xs mt-2">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>
