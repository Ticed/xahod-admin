<script setup lang="ts">
import { Label } from '@/registry/new-york/ui/label'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/registry/new-york/ui/number-field'
</script>

<template>
  <NumberField id="age-disabled" :default-value="18" disabled>
    <Label for="age-disabled">Age</Label>
    <NumberFieldContent>
      <NumberFieldDecrement />
      <NumberFieldInput />
      <NumberFieldIncrement />
    </NumberFieldContent>
  </NumberField>
</template>
