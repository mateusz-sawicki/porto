<script lang="ts">
export const description = 'A sidebar that collapses to icons.'
export const iframeHeight = '800px'
export const containerClass = 'w-full h-full'
</script>

<script setup lang="ts">
import AppSidebar from '@/components/layout/sidebar/AppSidebar.vue'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { RouterView } from 'vue-router'
import AppHeader from '@/components/layout/header/AppHeader.vue'
import ContentLayout from './ContentLayout.vue'
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <AppHeader />
      <ContentLayout>
        <RouterView />
      </ContentLayout>
    </SidebarInset>
  </SidebarProvider>
</template>
