<script setup lang="ts">
import { Button } from '@/registry/default/ui/button'
import { Input } from '@/registry/default/ui/input'
</script>

<template>
  <div class="flex w-full max-w-sm items-center gap-1.5">
    <Input id="email" type="email" placeholder="Email" />
    <Button type="submit">
      Subscribe
    </Button>
  </div>
</template>
