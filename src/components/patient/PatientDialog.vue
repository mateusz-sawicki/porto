<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
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
import type { AddPatient, UpdatePatient } from '@/types/patient/patient'
import { DialogMode } from '@/types/common/status'
import { preventDialogClose, useApiCall } from '@/composables/useApiCall'
import { usePatients } from '@/composables/patient/usePatients'
import { patientApi } from '@/services/patient/patientApi'

interface Props {
  open: boolean
  mode?: DialogMode
  patientId?: string
  patientData?: {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    dateOfBirth: Date
    gender: number
  }
}

interface Emits {
  (e: 'close'): void
  (e: 'update', patientData: any): void
}

const props = withDefaults(defineProps<Props>(), {
  mode: DialogMode.Add
})
const emit = defineEmits<Emits>()

const addPatientFormRef = ref()

// Use API call and patients composable
const { execute: executeApiCall } = useApiCall()
const { addPatient: createPatient } = usePatients()

// Reset form when dialog opens or populate with patient data for editing
watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      await nextTick()
      if (addPatientFormRef.value) {
        if (props.mode === DialogMode.Edit && props.patientData) {
          await addPatientFormRef.value.populateForm(props.patientData)
        } else {
          addPatientFormRef.value.resetForm()
        }
      }
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
  if (props.mode === DialogMode.Edit && props.patientId) {
    // For edit mode, convert AddPatient to UpdatePatient and call updatePatient API
    const updateData: UpdatePatient = {
      id: props.patientId,
      ...patientData
    }
    
    const result = await executeApiCall(() => patientApi.updatePatient(props.patientId!, updateData), {
      withOverlay: true,
      overlayMessage: 'Updating patient...',
    })

    if (result && result.success) {
      emit('update', patientData)
      emit('close')
    }
  } else {
    // For add mode, create the patient
    const result = await executeApiCall(() => createPatient(patientData), {
      withOverlay: true,
      overlayMessage: 'Adding patient...',
    })

    if (result) {
      emit('close')
    }
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
    <DialogContent class="sm:max-w-[800px]">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Plus class="w-5 h-5" />
          {{ mode === DialogMode.Edit ? 'Edit Patient' : 'Add New Patient' }}
        </DialogTitle>
      </DialogHeader>

      <div class="py-6">
        <AddPatientForm ref="addPatientFormRef" @save="handleSave" />
      </div>

      <DialogFooter>
        <Button variant="outline" type="button" @click="handleClose">Cancel</Button>
        <Button
          type="button"
          @click="handleSubmit"
          :disabled="!addPatientFormRef?.isValid || addPatientFormRef?.isSubmitting"
        >
          {{ 
            addPatientFormRef?.isSubmitting 
              ? (mode === DialogMode.Edit ? 'Saving...' : 'Adding...') 
              : (mode === DialogMode.Edit ? 'Save Changes' : 'Add Patient')
          }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
