<script setup lang="ts">
import { Input } from '@/registry/default/ui/input'
import { Label } from '@/registry/default/ui/label'
</script>

<template>
  <div class="grid w-full max-w-sm items-center gap-1.5">
    <Label for="email">Email</Label>
    <Input id="email" type="email" placeholder="Email" />
  </div>
</template>
