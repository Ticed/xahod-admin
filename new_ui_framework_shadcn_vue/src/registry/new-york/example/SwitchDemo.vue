<script setup lang="ts">
import { Label } from '@/registry/new-york/ui/label'
import { Switch } from '@/registry/new-york/ui/switch'
</script>

<template>
  <div class="flex items-center space-x-2">
    <Switch id="airplane-mode" />
    <Label for="airplane-mode">Airplane Mode</Label>
  </div>
</template>
