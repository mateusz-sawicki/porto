<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-vue-next'
import AddPatientForm from './AddPatientForm.vue'
import type { AddPatient } from '@/types/patient/patient'

interface Props {
  open: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'save', patientData: AddPatient): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const addPatientFormRef = ref()

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

const handleSave = (patientData: AddPatient) => {
  emit('save', patientData)
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
          Add New Patient
        </DialogTitle>
      </DialogHeader>

      <div class="py-6">
        <AddPatientForm 
          ref="addPatientFormRef"
          @save="handleSave"
          @cancel="handleClose"
        />
      </div>
    </DialogContent>
  </Dialog>
</template>
