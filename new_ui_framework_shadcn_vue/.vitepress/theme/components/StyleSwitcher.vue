<script setup lang="ts">
import type { SelectTriggerProps } from 'reka-ui'
import { cn } from '@/lib/utils'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/new-york/ui/select'
import { styles } from '@/registry/registry-styles'
import { useConfigStore } from '@/stores/config'

const props = defineProps<SelectTriggerProps & { class?: string }>()
const { config } = useConfigStore()
</script>

<template>
  <Select v-model="config.style">
    <SelectTrigger :class="cn('h-7 w-[145px] text-xs [&_svg]:h-4 [&_svg]:w-4', props.class)">
      <span class="text-muted-foreground">Style: </span>
      <SelectValue placeholder="Select style" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem v-for="style in styles" :key="style.name" :value="style.name" class="text-xs">
        {{ style.label }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>
