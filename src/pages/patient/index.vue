<script setup lang="ts">
import { ref } from 'vue'
import StatsCards from '@/components/patient/StatsCards.vue'
import PatientManagementCard from '@/components/patient/PatientManagementCard.vue'
import AddPatientDialog from '@/components/patient/AddPatientDialog.vue'
import { usePatients } from '@/composables/patient/usePatients'

// Use patients composable
const {
  patients,
  stats,
  loading,
  error,
  refreshPatients,
  addPatient: createPatient,
  deletePatient,
} = usePatients()

// Add patient dialog state
const isAddPatientDialogOpen = ref(false)

// Dialog handlers
const openAddPatientDialog = () => {
  isAddPatientDialogOpen.value = true
}

const closeAddPatientDialog = () => {
  isAddPatientDialogOpen.value = false
}

// Handle patient creation
const handlePatientCreated = async (patientData: any) => {
  try {
    const result = await createPatient(patientData)

    if (result) {
      closeAddPatientDialog()
      // No need to refresh - createPatient already updates the local array
    } else {
      // Handle error case
      console.error('Failed to add patient')
      // You might want to show a toast notification here
    }
  } catch (error) {
    console.error('Error adding patient:', error)
    // Handle error (show toast, etc.)
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Statistics Cards -->
    <StatsCards :stats="stats" />

    <!-- Patient Management Table -->
    <PatientManagementCard
      :patients="patients"
      :loading="loading"
      :error="error"
      :delete-patient="deletePatient"
      @add-patient="openAddPatientDialog"
      @refresh="refreshPatients"
    />

    <!-- Add Patient Dialog -->
    <AddPatientDialog
      :open="isAddPatientDialogOpen"
      @close="closeAddPatientDialog"
      @save="handlePatientCreated"
    />
  </div>
</template>
