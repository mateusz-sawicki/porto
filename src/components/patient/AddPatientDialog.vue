<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-vue-next'
import AddPatientForm from './AddPatientForm.vue'
import type { AddPatient } from '@/types/patient/patient'
import { preventDialogClose, useApiCall } from '@/composables/useApiCall'
import { usePatients } from '@/composables/patient/usePatients'

interface Props {
  open: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const addPatientFormRef = ref()

// Use API call and patients composable
const { execute: executeApiCall } = useApiCall()
const { addPatient: createPatient } = usePatients()

// Reset form when dialog opens
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen && addPatientFormRef.value) {
      addPatientFormRef.value.resetForm()
    }
  },
)

const handleClose = () => {
  emit('close')
}

const handleSubmit = () => {
  if (addPatientFormRef.value) {
    addPatientFormRef.value.submitForm()
  }
}

const handleSave = async (patientData: AddPatient) => {
  const result = await executeApiCall(() => createPatient(patientData), {
    withOverlay: true,
    overlayMessage: 'Adding patient...',
  })

  if (result) {
    emit('close')
  }
}

// Handle dialog open/close state
const dialogOpen = computed({
  get: () => props.open,
  set: (value) => {
    if (!value) {
      emit('close')
    }
  },
})
</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <DialogContent 
      class="sm:max-w-[800px]"
      @escapeKeyDown="preventDialogClose"
      @interactOutside="preventDialogClose"
      @pointerDownOutside="preventDialogClose"
    >
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Plus class="w-5 h-5" />
          Add New Patient
        </DialogTitle>
      </DialogHeader>

      <div class="py-6">
        <AddPatientForm 
          ref="addPatientFormRef"
          @save="handleSave"
        />
      </div>

      <DialogFooter>
        <Button variant="outline" @click="handleClose">Cancel</Button>
        <Button 
          variant="secondary" 
          @click="() => addPatientFormRef?.testGenericDialog()"
        >
          Test Dialog
        </Button>
        <Button 
          @click="handleSubmit"
          :disabled="!addPatientFormRef?.isValid || addPatientFormRef?.isSubmitting"
        >
          {{ addPatientFormRef?.isSubmitting ? 'Adding...' : 'Add Patient' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
