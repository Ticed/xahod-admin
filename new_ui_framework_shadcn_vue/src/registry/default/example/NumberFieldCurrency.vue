<script setup lang="ts">
import { Label } from '@/registry/default/ui/label'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/registry/default/ui/number-field'
</script>

<template>
  <NumberField
    id="balance"
    :default-value="1500"
    :format-options="{
      style: 'currency',
      currency: 'EUR',
      currencyDisplay: 'code',
      currencySign: 'accounting',
    }"
  >
    <Label for="balance">Balance</Label>
    <NumberFieldContent>
      <NumberFieldDecrement />
      <NumberFieldInput />
      <NumberFieldIncrement />
    </NumberFieldContent>
  </NumberField>
</template>
