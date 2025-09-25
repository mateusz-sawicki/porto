<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

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
  handleNextStep
})

function loadFormData() {
  if (props.treatmentPlan && props.treatmentPlan.stepsDetails) {
    const currentStep = props.treatmentPlan.stepsDetails.find((step: any) => step.detailsStep === props.stepIndex)
    let currentStepData = currentStep?.detailsData

    // If the data is nested incorrectly (has stepsDetails property), extract the actual data
    if (currentStepData && currentStepData.stepsDetails && Array.isArray(currentStepData.stepsDetails)) {
      const nestedStep = currentStepData.stepsDetails.find((step: any) => step.detailsStep === props.stepIndex)
      currentStepData = nestedStep?.detailsData || currentStepData
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
      }
    }
  }
}

watch([() => props.treatmentPlan, () => vueformRef.value], ([plan, form]) => {
  if (plan && form && plan.stepsDetails) {
    loadFormData()
  }
})

onMounted(() => {
  console.log('MedicalInterviewStep mounted with props:', props)
  console.log('Treatment plan:', props.treatmentPlan)
  console.log('Step index:', props.stepIndex)

  if (props.treatmentPlan && props.treatmentPlan.stepsConfig) {
    const currentStepConfig = props.treatmentPlan.stepsConfig[props.stepIndex.toString()]
    if (currentStepConfig) {
      dynamicSchema.value = currentStepConfig
    }
  }

  if (props.treatmentPlan && props.treatmentPlan.stepsDetails) {
    console.log('Steps details:', props.treatmentPlan.stepsDetails)
    const currentStep = props.treatmentPlan.stepsDetails.find((step: any) => step.detailsStep === props.stepIndex)
    console.log('Current step found:', currentStep)
    let currentStepData = currentStep?.detailsData
    console.log('Current step data (raw):', currentStepData)

    // If the data is nested incorrectly (has stepsDetails property), extract the actual data
    if (currentStepData && currentStepData.stepsDetails && Array.isArray(currentStepData.stepsDetails)) {
      const nestedStep = currentStepData.stepsDetails.find((step: any) => step.detailsStep === props.stepIndex)
      currentStepData = nestedStep?.detailsData || currentStepData
      console.log('Extracted nested step data:', currentStepData)
    }

    if (currentStepData && Object.keys(currentStepData).length > 0) {
      formDataModel.value = { ...currentStepData }
      console.log('Form data model set to:', formDataModel.value)
    } else {
      formDataModel.value = {}
      console.log('Form data model set to empty object')
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
