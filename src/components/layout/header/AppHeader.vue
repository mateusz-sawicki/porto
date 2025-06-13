<script setup lang="ts">
import ThemeSwitch from '@/components/layout/ThemeSwitch.vue'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useBreadcrumbs } from '../../../composables/layout/useBreadcrumbs'
import { Slash } from 'lucide-vue-next'

const { breadcrumbs } = useBreadcrumbs()
</script>

<template>
  <header
    class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
  >
    <div class="flex items-center gap-2 px-4">
      <SidebarTrigger class="-ml-1" />
      <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
      <Breadcrumb class="">
        <BreadcrumbList>
          <template v-for="(item, index) in breadcrumbs" :key="item.label">
            <BreadcrumbItem>
              <BreadcrumbPage v-if="item.isActive">
                {{ item.label }}
              </BreadcrumbPage>

              <!-- Clickable breadcrumb -->
              <BreadcrumbLink v-else asChild>
                <router-link :to="item.href || '/'">
                  {{ item.label }}
                </router-link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <!-- Separator -->
            <BreadcrumbSeparator v-if="index < breadcrumbs.length - 1">
              <Slash />
            </BreadcrumbSeparator>
          </template>
        </BreadcrumbList>
      </Breadcrumb>
      <ThemeSwitch />
    </div>
  </header>
</template>
