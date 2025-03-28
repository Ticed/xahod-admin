<script setup lang="ts">
import type { TableOfContents, TableOfContentsItem } from '../types/docs'
import { buttonVariants } from '@/registry/default/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/registry/default/ui/collapsible'
import { onContentUpdated } from 'vitepress'
import { shallowRef } from 'vue'
import CarbonAds from '../components/CarbonAds.vue'
import TableOfContentTree from './TableOfContentTree.vue'

defineProps<{
  showCarbonAds?: boolean
}>()

const headers = shallowRef<TableOfContents>({ items: [] })

function getHeadingsWithHierarchy(divId: string) {
  const div = document.querySelector(divId)
  if (!div)
    return { items: [] }

  const headings: HTMLHeadingElement[] = Array.from(
    div.querySelectorAll('h2, h3'),
  )
  const hierarchy: TableOfContents = { items: [] }
  let currentLevel: TableOfContentsItem | undefined

  headings.forEach((heading: HTMLHeadingElement) => {
    const level = Number.parseInt(heading.tagName.charAt(1))
    if (!heading.id) {
      const newId = heading.textContent
        ?.replaceAll(/[^a-z0-9 ]/gi, '')
        .replaceAll(' ', '-')
        .toLowerCase()
      heading.id = `${newId}`
    }

    const item: TableOfContentsItem = {
      title: heading.textContent || '',
      url: `#${heading.id}`,
      items: [],
      heading,
    }

    if (level === 2) {
      hierarchy.items.push(item)
      currentLevel = item
    }
    else if (level === 3 && currentLevel?.items) {
      currentLevel.items.push(item)
    }
    else {
      hierarchy.items.push(item)
    }
  })
  return hierarchy
}

onContentUpdated(() => {
  headers.value = getHeadingsWithHierarchy('.vp-doc')
})
</script>

<template>
  <div class="hidden xl:block no-scrollbar h-full overflow-auto pb-16">
    <div class="space-y-2">
      <p class="font-medium">
        On This Page
      </p>
      <TableOfContentTree :tree="headers" :level="1" />
      <CarbonAds v-if="showCarbonAds" />
    </div>
  </div>

  <div class="block xl:hidden mb-6">
    <Collapsible>
      <CollapsibleTrigger :class="buttonVariants({ variant: 'outline' })">
        On This Page
      </CollapsibleTrigger>
      <CollapsibleContent class="text-sm mt-4 border-l pl-4">
        <TableOfContentTree :tree="headers" :level="1" />
      </CollapsibleContent>
    </Collapsible>
  </div>
</template>
