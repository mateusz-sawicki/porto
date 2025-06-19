<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserCheck, UserX } from 'lucide-vue-next'

interface Stats {
  total: number
  active: number
  inactive: number
  filtered: number
}

interface Props {
  stats: Stats
}

const props = defineProps<Props>()

// Computed percentages
const activePercentage = computed(() => {
  if (props.stats.total === 0) return 0
  return Math.round((props.stats.active / props.stats.total) * 100)
})

const inactivePercentage = computed(() => {
  if (props.stats.total === 0) return 0
  return Math.round((props.stats.inactive / props.stats.total) * 100)
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <!-- Total Patients Card -->
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Total Patients</CardTitle>
        <Users class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{{ stats.total }}</div>
        <p class="text-xs text-muted-foreground">{{ stats.filtered }} after filtering</p>
      </CardContent>
    </Card>

    <!-- Active Patients Card -->
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Active Patients</CardTitle>
        <UserCheck class="h-4 w-4 text-green-500" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold text-green-600">{{ stats.active }}</div>
        <p class="text-xs text-muted-foreground">{{ activePercentage }}% of total</p>
      </CardContent>
    </Card>

    <!-- Inactive Patients Card -->
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Inactive Patients</CardTitle>
        <UserX class="h-4 w-4 text-red-500" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold text-red-600">{{ stats.inactive }}</div>
        <p class="text-xs text-muted-foreground">{{ inactivePercentage }}% of total</p>
      </CardContent>
    </Card>
  </div>
</template>
