<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Code2, ExternalLink } from 'lucide-vue-next'
import { useData, useRoute } from 'vitepress'
import DocsBreadcrumb from '../components/DocsBreadcrumb.vue'
import EditLink from '../components/EditLink.vue'
import TableOfContent from '../components/TableOfContent.vue'
import { docsConfig } from '../config/docs'

const $route = useRoute()
const { frontmatter } = useData()

const sourceLink = 'https://github.com/unovue/shadcn-vue/tree/dev/'
</script>

<template>
  <div class="container-wrapper">
    <div class="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <aside class="border-grid fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 border-r md:sticky md:block">
        <div class="no-scrollbar h-full overflow-auto py-6 pr-6 lg:py-8">
          <div v-for="docsGroup in docsConfig.sidebarNav" :key="docsGroup.title">
            <div class="pb-4">
              <h4 class="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
                {{ docsGroup.title }}

                <span v-if="docsGroup.label" class="ml-2 font-normal rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">
                  {{ docsGroup.label }}
                </span>
              </h4>

              <div class="grid grid-flow-row auto-rows-max gap-0.5 text-sm">
                <template
                  v-for="doc in docsGroup.items "
                  :key="doc.title"
                >
                  <a
                    v-if="doc.href"
                    :disabled="doc.disabled"
                    :href="doc.href"
                    :class="cn('group flex h-8 w-full items-center rounded-lg px-2 font-normal text-foreground underline-offset-2 hover:bg-accent hover:text-accent-foreground', doc.disabled && 'cursor-not-allowed opacity-60', $route.path === `${doc.href}.html` && 'bg-accent font-medium text-accent-foreground')"
                  >
                    {{ doc.title }}

                    <span v-if="doc.label" class="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">
                      {{ doc.label }}
                    </span>
                  </a>
                </template>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main class="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
        <div class="mx-auto w-full min-w-0 max-w-2xl">
          <div class="block xl:hidden">
            <TableOfContent />
          </div>

          <DocsBreadcrumb class="mb-4" />

          <div class="space-y-2">
            <div class="flex items-center space-x-4">
              <h1 class="scroll-m-20 text-3xl font-bold tracking-tight">
                {{ frontmatter.title }}
              </h1>
              <span v-if="frontmatter.label" class="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">
                {{ frontmatter.label }}
              </span>
            </div>
            <p class="text-base text-muted-foreground">
              {{ frontmatter.description }}
            </p>
          </div>

          <div v-if="frontmatter.docs || frontmatter.source || frontmatter.primitive" class="flex items-center space-x-2 pt-4">
            <a v-if="frontmatter.docs" :href="frontmatter.docs" target="_blank" class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
              <ExternalLink class="ml-1 h-3 w-3" />
              Docs
            </a>
            <a v-if="frontmatter.source" :href="sourceLink + frontmatter.source" target="_blank" class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
              Component Source
              <Code2 class="ml-1 h-3 w-3" />
            </a>
            <a v-if="frontmatter.primitive" :href="frontmatter.primitive" target="_blank" class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
              API Reference
              <ExternalLink class="ml-1 h-3 w-3" />
            </a>
          </div>

          <div class="vp-doc py-8">
            <slot />
          </div>

          <EditLink />
        </div>

        <div class="hidden text-sm xl:block">
          <div class="sticky top-20 -mt-6 h-[calc(100vh-3.5rem)] pt-4">
            <TableOfContent show-carbon-ads />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
