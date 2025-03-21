<script setup lang="ts">
import { cn } from '@/lib/utils'
</script>

<template>
  <nav
    :class="cn('flex items-center space-x-4 lg:space-x-6', $attrs.class ?? '')"
  >
    <a
      href="/dashboard"
      class="text-sm font-medium transition-colors hover:text-primary"
    >
      Dashboard
    </a>
    <a
      href="/transactions"
      class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
    >
      Transactions
    </a>
    <a
      href="/trading"
      class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
    >
      Trading
    </a>
    <a
      href="/transfer"
      class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
    >
      Transfer
    </a>
    <a
      href="/control-panel"
      class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
    >
      Control Panel
    </a>
    <a
      href="/settings"
      class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
    >
      Settings
    </a>
  </nav>
</template>
