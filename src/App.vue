<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Initialize the router
const router = useRouter()

// When the component mounts, ensure we're on a valid route
onMounted(() => {
  if (router.currentRoute.value.path === '/') {
    router.push('/dashboard/home')
  }
})
</script>

<style>
/* Global styles can be added here */
</style>
