<script setup lang="ts">
import DataTable from './DataTable.vue'
import { columns } from './columns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, UserCheck, UserX, RefreshCw, Database } from 'lucide-vue-next'
import { usePatients } from '@/composables/patient/usePatients'

// Use patients composable
const { patients, stats, loading, error, isDevelopment, refreshPatients } = usePatients()
</script>

<template>
  <div class="space-y-6">
    <!-- Header with Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Active Patients</CardTitle>
          <UserCheck class="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-green-600">{{ stats.active }}</div>
          <p class="text-xs text-muted-foreground">
            {{ Math.round((stats.active / stats.total) * 100) }}% of total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Inactive Patients</CardTitle>
          <UserX class="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-red-600">{{ stats.inactive }}</div>
          <p class="text-xs text-muted-foreground">
            {{ Math.round((stats.inactive / stats.total) * 100) }}% of total
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- Data Table -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="flex items-center gap-2">
              Patient Management
              <Badge v-if="isDevelopment" variant="secondary" class="text-xs">
                <Database class="h-3 w-3 mr-1" />
                Mock Data
              </Badge>
            </CardTitle>
            <CardDescription>
              Manage your dental practice patients with advanced filtering and sorting
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" :disabled="loading" @click="refreshPatients">
            <RefreshCw class="h-4 w-4 mr-2" :class="{ 'animate-spin': loading }" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <!-- Error State -->
        <div v-if="error" class="text-center py-8">
          <div class="flex items-center justify-center text-red-600 mb-4">
            <span class="mr-2">⚠️</span>
            <span>{{ error }}</span>
          </div>
          <Button variant="outline" @click="refreshPatients"> Try Again </Button>
        </div>

        <!-- Loading State -->
        <div v-else-if="loading" class="text-center py-8">
          <div class="flex items-center justify-center">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span class="ml-2">Loading patients...</span>
          </div>
        </div>

        <!-- Data Table -->
        <DataTable v-else :columns="columns" :data="patients" />
      </CardContent>
    </Card>
  </div>
</template>
