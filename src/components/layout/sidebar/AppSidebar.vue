<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'

import { data } from '@/components/layout/sidebar/data/data.ts'
import NavMain from '@/components/layout/sidebar/NavMain.vue'
import NavUser from '@/components/layout/sidebar/NavUser.vue'
import TeamSwitcher from '@/components/TeamSwitcher.vue'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

const props = withDefaults(defineProps<SidebarProps>(), {
  variant: 'floating',
  collapsible: 'icon',
})

// This is sample data.
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <TeamSwitcher :teams="data.teams" />
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="data.navMain" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="data.user" />
    </SidebarFooter>
  </Sidebar>
</template>
