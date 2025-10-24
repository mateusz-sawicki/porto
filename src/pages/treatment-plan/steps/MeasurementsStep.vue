<script setup lang="ts">
import { ref, onMounted, watch, inject, nextTick } from 'vue'

interface Props {
  treatmentPlan: any
  stepIndex: number
  isLoading?: boolean
  onNext: (data: any) => void
  isReadonly?: boolean
}

const props = defineProps<Props>()

const vueformRef = ref<any>(null)
const formDataModel = ref({})
const dynamicSchema = ref({})

function getOnlyFilledValues(data: any): Record<string, any> {
  const filled: Record<string, any> = {}

  for (const [key, value] of Object.entries(data || {})) {
    if (
      value === true ||
      (typeof value === 'string' && value.trim() !== '') ||
      (Array.isArray(value) && value.length > 0) ||
      (value !== null && value !== undefined && value !== false && value !== '' && !Array.isArray(value))
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
  // Load config from API - same as MedicalInterviewStep
  if (props.treatmentPlan && props.treatmentPlan.currentStepConfig) {
    const currentStepConfig = props.treatmentPlan.currentStepConfig
    if (currentStepConfig) {
      // Check if config has container structure
      if (currentStepConfig.container?.schema) {
        dynamicSchema.value = currentStepConfig.container.schema
      } else if (currentStepConfig.container) {
        dynamicSchema.value = currentStepConfig.container
      } else {
        dynamicSchema.value = currentStepConfig
      }
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
  <div class="space-y-4" :class="{ 'pointer-events-none': props.isReadonly }">
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