<script setup lang="ts">
import { Card, CardContent } from '@/registry/default/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/registry/default/ui/carousel'
</script>

<template>
  <Carousel v-slot="{ canScrollNext }" class="relative w-full max-w-xs">
    <CarouselContent>
      <CarouselItem v-for="(_, index) in 5" :key="index">
        <div class="p-1">
          <Card>
            <CardContent class="flex aspect-square items-center justify-center p-6">
              <span class="text-4xl font-semibold">{{ index + 1 }}</span>
            </CardContent>
          </Card>
        </div>
      </CarouselItem>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext v-if="canScrollNext" />
  </Carousel>
</template>
