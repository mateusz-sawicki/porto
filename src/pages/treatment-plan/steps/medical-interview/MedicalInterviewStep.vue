<template>
  <div class="space-y-6">
    <MedicalHistory v-model="medicalHistoryData" @update:modelValue="updateMedicalHistory" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MedicalHistory from './MedicalHistory.vue'

interface MedicalHistoryData {
  [key: string]: {
    checked: boolean
    notes?: string
  }
}

interface BasicInformationData {
  medicalHistory: MedicalHistoryData
}

interface Props {
  formData: BasicInformationData
}

interface Emits {
  (e: 'update:formData', data: BasicInformationData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const medicalHistoryData = ref<MedicalHistoryData>(props.formData.medicalHistory || {})

const updateMedicalHistory = (data: MedicalHistoryData) => {
  medicalHistoryData.value = data
  const updatedData = { ...props.formData, medicalHistory: data }
  emit('update:formData', updatedData)
}
</script>
