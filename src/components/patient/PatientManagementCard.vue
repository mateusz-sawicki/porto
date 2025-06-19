<script setup lang="ts">
import DataTable from '@/components/patient/DataTable.vue'
import ErrorState from '@/components/patient/ErrorState.vue'
import LoadingState from '@/components/patient/LoadingState.vue'
import PatientManagementHeader from '@/components/patient/PatientManagementHeader.vue'
import { columns } from '@/components/patient/columns'
import { Card, CardContent } from '@/components/ui/card'
import type { Patient } from '@/types/patient/patient'

interface Props {
  patients: readonly Patient[]
  loading: boolean
  error: string | null
  isDevelopment: boolean
}

interface Emits {
  (e: 'add-patient'): void
  (e: 'refresh'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <Card>
    <!-- Header -->
    <PatientManagementHeader
      :is-development="isDevelopment"
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
