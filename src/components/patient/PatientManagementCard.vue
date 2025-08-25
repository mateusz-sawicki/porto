<script setup lang="ts">
import DataTable from '@/components/patient/DataTable.vue'
import ErrorState from '@/components/patient/ErrorState.vue'
import LoadingState from '@/components/patient/LoadingState.vue'
import PatientManagementHeader from '@/components/patient/PatientManagementHeader.vue'
import { createColumns } from '@/components/patient/columns'
import { Card, CardContent } from '@/components/ui/card'
import type { Patient } from '@/types/patient/patient'

interface Props {
  patients: readonly Patient[]
  loading: boolean
  error: string | null
  deletePatient?: (id: string) => Promise<boolean>
}

interface Emits {
  (e: 'add-patient'): void
  (e: 'refresh'): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

// Create columns with actual delete function if provided
const columns = createColumns(props.deletePatient || (async (id: string) => {
  console.warn('Delete not available - no deletePatient prop provided')
  return false
}))
</script>

<template>
  <Card>
    <!-- Header -->
    <PatientManagementHeader
      :loading="loading"
      @add-patient="$emit('add-patient')"
      @refresh="$emit('refresh')"
    />

    <CardContent>
      <!-- Error State -->
      <ErrorState v-if="error" :error="error" @retry="$emit('refresh')" />

      <!-- Loading State -->
      <LoadingState v-else-if="loading" />

      <!-- Data Table -->
      <DataTable v-else :columns="columns" :data="patients" />
    </CardContent>
  </Card>
</template>
