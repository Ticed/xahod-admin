<script setup lang="ts">
import { Checkbox } from '@/registry/new-york/ui/checkbox'
import { Label } from '@/registry/new-york/ui/label'
</script>

<template>
  <div>
    <div class="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label for="terms">Accept terms and conditions</Label>
    </div>
  </div>
</template>
