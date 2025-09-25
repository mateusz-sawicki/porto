<script setup lang="ts">
import { ref, computed, onMounted, provide } from 'vue'
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import OdontogramStep from './steps/OdontogramStep.vue'
import MedicalInterviewStep from './steps/MedicalInterviewStep.vue'
import TreatmentPlanStepper from './components/TreatmentPlanStepper.vue'
import { treatmentPlanApi, type TreatmentPlan } from '@/services/treatmentPlan/treatmentPlanApi'
import type { Step, StepData, StepDetails, StepsDetails, MedicalInterviewStepRef } from './types'

const STRINGS = {
  BUTTON_LABELS: {
    BACK: 'Back',
    NEXT: 'Next',
    SAVING: 'Saving...',
    SAVE_PROGRESS: 'Save Progress',
    SUBMIT_TREATMENT_PLAN: 'Submit Treatment Plan',
  },
  BUTTON_VARIANTS: {
    OUTLINE: 'outline',
  },
  BUTTON_SIZES: {
    SM: 'sm',
  },
  CSS_CLASSES: {
    FLEX_ITEMS_CENTER_JUSTIFY_BETWEEN: 'flex items-center justify-between',
    FLEX_GAP_2: 'flex gap-2',
  },
  ERROR_MESSAGES: {
    PROCESSING_FORM_DATA: 'Error processing form data:',
    SAVING_PROGRESS: 'Error saving progress:',
    SUBMITTING_TREATMENT_PLAN: 'Error submitting treatment plan:',
    FETCHING_TREATMENT_PLAN: 'Error fetching treatment plan:',
  },
  STEP_TITLES: {
    TREATMENT_PLAN_INFORMATION: 'Treatment Plan Information',
    ODONTOGRAM: 'Odontogram',
  },
  STEP_DESCRIPTIONS: {
    PROVIDE_TREATMENT_PLAN_DETAILS: 'Provide treatment plan details',
    CONFIGURE_TOOTH_TREATMENTS: 'Configure tooth treatments',
  },
  UI_TEXT: {
    LOADING_TREATMENT_PLAN: 'Loading treatment plan...',
  },
  PROVIDE_KEYS: {
    SAVE_PROGRESS: 'saveProgress',
    IS_SAVING: 'isSaving',
  },
} as const

const route = useRoute()

const stepIndex = ref(1)
const steps: Step[] = [
  {
    step: 1,
    title: STRINGS.STEP_TITLES.TREATMENT_PLAN_INFORMATION,
    description: STRINGS.STEP_DESCRIPTIONS.PROVIDE_TREATMENT_PLAN_DETAILS,
  },
  {
    step: 2,
    title: STRINGS.STEP_TITLES.ODONTOGRAM,
    description: STRINGS.STEP_DESCRIPTIONS.CONFIGURE_TOOTH_TREATMENTS,
  },
]

const stepsDetails = ref<StepsDetails>({
  stepsDetails: []
})
const isLoading = ref<boolean>(false)
const treatmentPlan = ref<TreatmentPlan | null>(null)
const isLoadingData = ref<boolean>(true)
const isSaving = ref<boolean>(false)
const medicalInterviewStepRef = ref<MedicalInterviewStepRef | null>(null)

// Computed property that merges treatment plan with current steps data
const treatmentPlanWithSteps = computed(() => {
  if (!treatmentPlan.value) return null

  return {
    ...treatmentPlan.value,
    stepsDetails: stepsDetails.value.stepsDetails
  }
})

async function onStepSubmit(data: StepData): Promise<void> {
  isLoading.value = true

  try {
    const existingIndex = stepsDetails.value.stepsDetails.findIndex(step => step.detailsStep === stepIndex.value)
    const stepDetail: StepDetails = {
      detailsStep: stepIndex.value,
      detailsData: data
    }

    if (existingIndex >= 0) {
      stepsDetails.value.stepsDetails[existingIndex] = stepDetail
    } else {
      stepsDetails.value.stepsDetails.push(stepDetail)
    }

    nextStep()
  } catch (error) {
    console.error(STRINGS.ERROR_MESSAGES.PROCESSING_FORM_DATA, error)
    nextStep()
  } finally {
    isLoading.value = false
  }
}

async function saveProgress(): Promise<void> {
  isSaving.value = true

  try {
    let currentStepData: StepData = {}

    if (stepIndex.value === 1 && medicalInterviewStepRef.value) {
      currentStepData = medicalInterviewStepRef.value.getFormData()
      console.log('Got form data from ref:', currentStepData)
    }

    const existingIndex = stepsDetails.value.stepsDetails.findIndex(step => step.detailsStep === stepIndex.value)
    const stepDetail: StepDetails = {
      detailsStep: stepIndex.value,
      detailsData: currentStepData
    }

    if (existingIndex >= 0) {
      stepsDetails.value.stepsDetails[existingIndex] = stepDetail
      console.log('Updated existing step at index:', existingIndex)
    } else {
      stepsDetails.value.stepsDetails.push(stepDetail)
      console.log('Added new step to array')
    }

    console.log('Current stepsDetails:', stepsDetails.value)
    console.log('treatmentPlanWithSteps computed:', treatmentPlanWithSteps.value)

    if (treatmentPlan.value?.id) {
      await treatmentPlanApi.saveProgress(treatmentPlan.value.id, currentStepData)
    }
  } catch (error) {
    console.error(STRINGS.ERROR_MESSAGES.SAVING_PROGRESS, error)
  } finally {
    isSaving.value = false
  }
}

async function onFinalSubmit(): Promise<void> {
  isLoading.value = true

  try {
    if (treatmentPlan.value?.id) {
      await treatmentPlanApi.saveProgress(treatmentPlan.value.id, stepsDetails.value)
    }
  } catch (error) {
    console.error(STRINGS.ERROR_MESSAGES.SUBMITTING_TREATMENT_PLAN, error)
  } finally {
    isLoading.value = false
  }
}

function handleNext(): void {
  if (stepIndex.value === 1 && medicalInterviewStepRef.value) {
    medicalInterviewStepRef.value.handleNextStep()
  } else {
    nextStep()
  }
}

function nextStep(): void {
  if (stepIndex.value < steps.length) {
    stepIndex.value++
  }
}

function prevStep(): void {
  if (stepIndex.value > 1) {
    stepIndex.value--
  }
}

async function fetchTreatmentPlan(): Promise<void> {
  try {
    isLoadingData.value = true
    const planId = route.params.planId as string
    treatmentPlan.value = await treatmentPlanApi.getTreatmentPlanById(planId)

    // Initialize stepsDetails from treatment plan if it exists
    if (treatmentPlan.value?.stepsDetails) {
      stepsDetails.value.stepsDetails = treatmentPlan.value.stepsDetails
    }
  } catch (error) {
    console.error(STRINGS.ERROR_MESSAGES.FETCHING_TREATMENT_PLAN, error)
  } finally {
    isLoadingData.value = false
  }
}

provide(STRINGS.PROVIDE_KEYS.SAVE_PROGRESS, saveProgress)
provide(STRINGS.PROVIDE_KEYS.IS_SAVING, isSaving)

onMounted(() => {
  fetchTreatmentPlan()
})
</script>

<template>
  <div class="w-full">
    <!-- Loading state -->
    <div v-if="isLoadingData" class="flex justify-center items-center h-64">
      <div class="text-lg">{{ STRINGS.UI_TEXT.LOADING_TREATMENT_PLAN }}</div>
    </div>

    <!-- Main content -->
    <div v-else class="block w-full">
      <!-- Treatment Plan Stepper -->
      <TreatmentPlanStepper
        :steps="steps"
        :current-step="stepIndex"
        :on-step-change="(step: number) => (stepIndex = step)"
      />

      <!-- Top button section -->
      <div :class="STRINGS.CSS_CLASSES.FLEX_ITEMS_CENTER_JUSTIFY_BETWEEN" class="mb-6">
        <Button
          :variant="STRINGS.BUTTON_VARIANTS.OUTLINE"
          :size="STRINGS.BUTTON_SIZES.SM"
          @click="prevStep()"
          :disabled="stepIndex <= 1"
        >
          {{ STRINGS.BUTTON_LABELS.BACK }}
        </Button>
        <div :class="STRINGS.CSS_CLASSES.FLEX_GAP_2">
          <Button
            :variant="STRINGS.BUTTON_VARIANTS.OUTLINE"
            :size="STRINGS.BUTTON_SIZES.SM"
            @click="saveProgress"
            :disabled="isSaving"
          >
            {{ isSaving ? STRINGS.BUTTON_LABELS.SAVING : STRINGS.BUTTON_LABELS.SAVE_PROGRESS }}
          </Button>
          <Button
            v-if="stepIndex < steps.length"
            :size="STRINGS.BUTTON_SIZES.SM"
            @click="handleNext"
            :disabled="isLoading"
          >
            {{ isLoading ? STRINGS.BUTTON_LABELS.SAVING : STRINGS.BUTTON_LABELS.NEXT }}
          </Button>
          <Button v-else :size="STRINGS.BUTTON_SIZES.SM" @click="onFinalSubmit()">
            {{ STRINGS.BUTTON_LABELS.SUBMIT_TREATMENT_PLAN }}
          </Button>
        </div>
      </div>

      <!-- Step content -->
      <div class="mt-6">
        <!-- Step 1: Medical Interview -->
        <div v-if="stepIndex === 1">
          <MedicalInterviewStep
            ref="medicalInterviewStepRef"
            :treatment-plan="treatmentPlanWithSteps"
            :step-index="stepIndex"
            :is-loading="isLoading"
            :on-next="onStepSubmit"
          />
        </div>

        <!-- Step 2: Odontogram -->
        <div v-if="stepIndex === 2">
          <OdontogramStep :isPediatric="true" />
        </div>
      </div>

      <!-- Common footer with navigation and save progress -->
      <div :class="STRINGS.CSS_CLASSES.FLEX_ITEMS_CENTER_JUSTIFY_BETWEEN" class="mt-6">
        <Button
          :variant="STRINGS.BUTTON_VARIANTS.OUTLINE"
          :size="STRINGS.BUTTON_SIZES.SM"
          @click="prevStep()"
          :disabled="stepIndex <= 1"
        >
          {{ STRINGS.BUTTON_LABELS.BACK }}
        </Button>
        <div :class="STRINGS.CSS_CLASSES.FLEX_GAP_2">
          <Button
            :variant="STRINGS.BUTTON_VARIANTS.OUTLINE"
            :size="STRINGS.BUTTON_SIZES.SM"
            @click="saveProgress"
            :disabled="isSaving"
          >
            {{ isSaving ? STRINGS.BUTTON_LABELS.SAVING : STRINGS.BUTTON_LABELS.SAVE_PROGRESS }}
          </Button>
          <Button
            v-if="stepIndex < steps.length"
            :size="STRINGS.BUTTON_SIZES.SM"
            @click="handleNext"
            :disabled="isLoading"
          >
            {{ isLoading ? STRINGS.BUTTON_LABELS.SAVING : STRINGS.BUTTON_LABELS.NEXT }}
          </Button>
          <Button v-else :size="STRINGS.BUTTON_SIZES.SM" @click="onFinalSubmit()">
            {{ STRINGS.BUTTON_LABELS.SUBMIT_TREATMENT_PLAN }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
