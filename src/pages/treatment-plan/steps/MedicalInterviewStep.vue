<script setup lang="ts">
import { ref, onMounted, watch, inject, nextTick } from 'vue'

interface Props {
  treatmentPlan: any
  stepIndex: number
  isLoading?: boolean
  onNext: (data: any) => void
}

const props = defineProps<Props>()

const vueformRef = ref<any>(null)
const formDataModel = ref({})
const dynamicSchema = ref({})

// Get function to mark data as modified from parent
const markAsModified = inject('markAsModified') as (() => void) | undefined

function getOnlyFilledValues(data: any): Record<string, any> {
  const filled: Record<string, any> = {}

  for (const [key, value] of Object.entries(data || {})) {
    if (
      value === true ||
      (typeof value === 'string' && value.trim() !== '') ||
      (value !== null && value !== undefined && value !== false && value !== '')
    ) {
      filled[key] = value
    }
  }

  return filled
}

function prepareFormData(data: any) {
  return data || {}
}

function handleNextStep() {
  if (vueformRef.value) {
    const formData = vueformRef.value.data
    props.onNext(formData)
  }
}

function getFormData() {
  if (vueformRef.value) {
    const allFormData = vueformRef.value.data
    const filledData = getOnlyFilledValues(allFormData)
    const stepData = prepareFormData(filledData)
    return stepData
  }
  return {}
}

defineExpose({
  getFormData,
  handleNextStep,
})

function loadFormData() {
  if (props.treatmentPlan && props.treatmentPlan.currentStepDetails) {
    const currentStep = props.treatmentPlan.currentStepDetails
    let currentStepData = currentStep?.detailsData

    // Check if this is the correct step for current stepIndex
    if (currentStep && currentStep.detailsStep === props.stepIndex) {
      currentStepData = currentStep.detailsData
    } else {
      currentStepData = {}
    }

    if (vueformRef.value && currentStepData && Object.keys(currentStepData).length > 0) {
      try {
        vueformRef.value.load(currentStepData)
      } catch (error) {
        console.error('Error loading data into form:', error)
      }
    } else {
      if (!vueformRef.value) {
        setTimeout(() => loadFormData(), 100)
        return
      }
    }
  }
}

watch([() => props.treatmentPlan, () => vueformRef.value], ([plan, form]) => {
  if (plan && form && plan.currentStepDetails) {
    loadFormData()
  }
})

onMounted(() => {

  if (props.treatmentPlan && props.treatmentPlan.currentStepConfig) {
    const currentStepConfig = props.treatmentPlan.currentStepConfig
    if (currentStepConfig) {
      dynamicSchema.value = currentStepConfig
    }
  }

  if (props.treatmentPlan && props.treatmentPlan.currentStepDetails) {
    const currentStep = props.treatmentPlan.currentStepDetails
    let currentStepData = currentStep?.detailsData

    // Check if this is the correct step for current stepIndex
    if (currentStep && currentStep.detailsStep === props.stepIndex) {
      currentStepData = currentStep.detailsData
    } else {
      currentStepData = {}
    }

    if (currentStepData && Object.keys(currentStepData).length > 0) {
      formDataModel.value = { ...currentStepData }
    } else {
      formDataModel.value = {}
    }
  }

})
</script>

<template>
  <div class="space-y-4">
    <Vueform
      ref="vueformRef"
      v-model="formDataModel"
      :schema="dynamicSchema"
      :prepare="prepareFormData"
      :endpoint="false"
      :submit-button="false"
      size="lg"
      sync
    />
  </div>
</template>
