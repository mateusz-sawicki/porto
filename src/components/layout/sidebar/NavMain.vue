<script setup lang="ts">
import { type LucideIcon } from 'lucide-vue-next'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Separator } from '../../ui/separator'
import { useRoute } from 'vue-router'

defineProps<{
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}>()

const route = useRoute()

// Helper function to check if route is active
const isActive = (url: string) => {
  return route.path === url || route.name === url.substring(1)
}
</script>

<template>
  <Separator class="mt-2" />
  <SidebarGroup>
    <SidebarMenu>
      <SidebarMenuItem v-for="item in items">
        <SidebarMenuButton asChild :isActive="isActive(item.url)">
          <router-link :to="item.url">
            <component :is="item.icon" v-if="item.icon" />
            <span>{{ item.title }}</span>
          </router-link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>
