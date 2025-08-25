<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-vue-next'
import AddPatientForm from '@/components/patient/AddPatientForm.vue'
import type { AddPatient } from '@/types/patient/patient'

const router = useRouter()

const handleCancel = () => {
  router.back()
}

const handleSave = (patientData: AddPatient) => {
  // TODO: Implement patient creation API call
  console.log('Creating patient:', patientData)
  
  // Navigate back after successful creation
  router.back()
}
</script>

<template>
  <div class="container mx-auto py-6">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <Button variant="ghost" @click="handleCancel" class="mb-4">
          <ArrowLeft class="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 class="text-2xl font-bold">Add New Patient</h1>
      </div>

      <!-- Form -->
      <div class="bg-card rounded-lg border p-6">
        <AddPatientForm 
          @save="handleSave"
          @cancel="handleCancel"
        />
      </div>
    </div>
  </div>
</template>