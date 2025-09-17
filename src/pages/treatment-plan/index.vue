<script setup lang="ts">
import { Check, Circle, Dot } from 'lucide-vue-next'
import { ref, onMounted, watch, provide } from 'vue'
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import OdontogramStep from './steps/OdontogramStep.vue'
// import { medicalInterviewSchema } from './schema.js' // Now using dynamic schema from API
import { treatmentPlanApi, type TreatmentPlan } from '@/services/treatmentPlan/treatmentPlanApi'

const route = useRoute()

// Function to filter only filled/meaningful values
function getOnlyFilledValues(data: any): Record<string, any> {
  const filled: Record<string, any> = {}

  for (const [key, value] of Object.entries(data || {})) {
    // Include value if it's:
    // - true (for booleans that are checked)
    // - non-empty string
    // - non-null and non-undefined meaningful values
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

// Vueform prepare function - transforms data before submission
function prepareFormData(data: any) {
  // This function receives clean data from Vueform and can transform it before API submission
  console.log('prepareFormData input:', data)
  const result = data || {}
  console.log('prepareFormData output:', result)
  return result
}

// Note: Flatten function removed as stepsData should already be in correct flat format

const stepIndex = ref(1)
const steps = [
  {
    step: 1,
    title: 'Treatment Plan Information',
    description: 'Provide treatment plan details',
  },
  {
    step: 2,
    title: 'Odontogram',
    description: 'Configure tooth treatments',
  },
]

const formData = ref({
  container: {},
  container_1: {},
  container_2: {},
  container_3: {},
})
const vueformRef = ref<any>(null)
const isLoading = ref(false)
const treatmentPlan = ref<TreatmentPlan | null>(null)
const isLoadingData = ref(true)
const formDataModel = ref({})
const dynamicSchema = ref({})
const isSaving = ref(false)

function handleNextStep() {
  console.log('handleNextStep called')
  if (vueformRef.value) {
    // Use form$.data to get current form data instead of submit event
    const formData = vueformRef.value.data
    console.log('Form data:', formData)
    onSubmitStep1(formData)
  } else {
    console.log('vueformRef.value is null')
  }
}

async function onSubmitStep1(data: any) {
  console.log('onSubmitStep1 called with data:', data)
  isLoading.value = true

  try {
    // Data is already clean from Vueform
    // Store the form data
    formData.value = data

    // Prepare form data using our prepare function
    const medicalInterviewStepData = prepareFormData(data)

    console.log('Form data prepared:', medicalInterviewStepData)

    // Proceed to next step without API call
    nextStep()
  } catch (error) {
    console.error('Error processing form data:', error)
    nextStep()
  } finally {
    isLoading.value = false
  }
}

async function saveProgress() {
  isSaving.value = true

  try {
    let stepData = {}

    console.log('saveProgress called - stepIndex:', stepIndex.value)
    console.log('vueformRef.value:', vueformRef.value)

    // Step 1: Get data from VueForm - only filled/meaningful values
    if (stepIndex.value === 1 && vueformRef.value) {
      // Get all form data first
      const allFormData = vueformRef.value.data
      console.log('All form data from VueForm:', allFormData)

      // Filter to only filled/meaningful values
      const filledData = getOnlyFilledValues(allFormData)
      console.log('Filtered filled data:', filledData)

      stepData = prepareFormData(filledData)
      console.log('Prepared step data (only filled):', stepData)

      formData.value = { ...formData.value, ...stepData }
    } else {
      console.log('Conditions not met - stepIndex:', stepIndex.value, 'vueformRef:', !!vueformRef.value)
    }

    console.log('Final stepData to send (only filled values):', stepData)

    // Save to backend via API
    if (treatmentPlan.value?.id) {
      console.log('Calling API with planId:', treatmentPlan.value.id, 'and stepData:', stepData)
      await treatmentPlanApi.saveProgress(treatmentPlan.value.id, stepData)
      console.log('API call successful')
    } else {
      console.log('No treatment plan ID available')
    }

    console.log('Progress saved (only filled values):', stepData)
    // You can add a toast notification here if needed

  } catch (error) {
    console.error('Error saving progress:', error)
  } finally {
    isSaving.value = false
  }
}

function onFinalSubmit() {
  console.log('Treatment plan submitted:', formData.value)
}

function nextStep() {
  if (stepIndex.value < steps.length) {
    stepIndex.value++
  }
}

function prevStep() {
  if (stepIndex.value > 1) {
    stepIndex.value--
  }
}

async function fetchTreatmentPlan() {
  try {
    isLoadingData.value = true
    const planId = route.params.planId as string
    treatmentPlan.value = await treatmentPlanApi.getTreatmentPlanById(planId)
    console.log('Treatment plan fetched:', treatmentPlan.value)

    // Extract dynamic schema for current step
    if (treatmentPlan.value && treatmentPlan.value.stepsConfig) {
      const currentStepConfig = treatmentPlan.value.stepsConfig[stepIndex.value.toString()]
      if (currentStepConfig) {
        dynamicSchema.value = currentStepConfig
        console.log('Dynamic schema loaded:', dynamicSchema.value)
      }
    }

    // Load data into reactive model from stepsData
    if (treatmentPlan.value && treatmentPlan.value.stepsData) {
      const currentStepData = treatmentPlan.value.stepsData[stepIndex.value.toString()]
      if (currentStepData && Object.keys(currentStepData).length > 0) {
        // Data exists for this step, use it directly (it should already be in flat format)
        formDataModel.value = { ...currentStepData }
        console.log('Form data model updated from stepsData:', formDataModel.value)
      } else {
        // No data for this step yet, initialize empty
        formDataModel.value = {}
        console.log('No existing data for step, initialized empty form')
      }
    }
  } catch (error) {
    console.error('Error fetching treatment plan:', error)
  } finally {
    isLoadingData.value = false
  }
}

async function loadFormData() {
  if (treatmentPlan.value && treatmentPlan.value.stepsData) {
    const currentStepData = treatmentPlan.value.stepsData[stepIndex.value.toString()]
    console.log('Form data to load:', currentStepData)
    console.log('VueformRef available:', !!vueformRef.value)

    if (vueformRef.value && currentStepData && Object.keys(currentStepData).length > 0) {
      try {
        vueformRef.value.load(currentStepData)
        console.log('Data loaded into form successfully')
        console.log('Current form data after load:', vueformRef.value.data)
      } catch (error) {
        console.error('Error loading data into form:', error)
      }
    } else {
      console.log('VueformRef not available or no data to load, retrying...')
      // Retry after a short delay if form ref is not available
      if (!vueformRef.value) {
        setTimeout(() => loadFormData(), 100)
      }
    }
  }
}

// Watch for when both treatment plan is loaded and form is ready
watch([() => treatmentPlan.value, () => vueformRef.value], ([plan, form]) => {
  if (plan && form && plan.stepsData && !isLoadingData.value) {
    loadFormData()
  }
})

// Provide save progress function to child components
provide('saveProgress', saveProgress)
provide('isSaving', isSaving)

onMounted(() => {
  fetchTreatmentPlan()
})
</script>

<template>
  <div class="w-full">
    <!-- Loading state -->
    <div v-if="isLoadingData" class="flex justify-center items-center h-64">
      <div class="text-lg">Loading treatment plan...</div>
    </div>

    <!-- Main content -->
    <div v-else class="block w-full">
      <!-- Custom stepper header -->
      <div class="flex w-full flex-start gap-2 mb-6">
        <div
          v-for="step in steps"
          :key="step.step"
          class="relative flex w-full flex-col items-center justify-center"
        >
          <div
            v-if="step.step !== steps[steps.length - 1].step"
            class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted"
            :class="{ 'bg-primary': step.step < stepIndex }"
          />

          <Button
            :variant="step.step <= stepIndex ? 'default' : 'outline'"
            size="icon"
            class="z-10 rounded-full shrink-0"
            :class="[
              step.step === stepIndex && 'ring-2 ring-ring ring-offset-2 ring-offset-background',
            ]"
            :disabled="step.step > stepIndex"
            @click="stepIndex = step.step"
          >
            <Check v-if="step.step < stepIndex" class="size-5" />
            <Circle v-else-if="step.step === stepIndex" />
            <Dot v-else />
          </Button>

          <div class="mt-5 flex flex-col items-center text-center">
            <div
              :class="[step.step === stepIndex && 'text-primary']"
              class="text-sm font-semibold transition lg:text-base"
            >
              {{ step.title }}
            </div>
            <div
              :class="[step.step === stepIndex && 'text-primary']"
              class="sr-only text-xs text-muted-foreground transition md:not-sr-only lg:text-sm"
            >
              {{ step.description }}
            </div>
          </div>
        </div>
      </div>

      <!-- Step content -->
      <div class="mt-6">
        <!-- Step 1: VueForms Treatment Plan Form -->
        <div v-if="stepIndex === 1">
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

            <div class="flex items-center justify-between pt-4">
              <Button disabled variant="outline" size="sm"> Back </Button>
              <div class="flex gap-2">
                <Button variant="outline" size="sm" @click="saveProgress" :disabled="isSaving">
                  {{ isSaving ? 'Saving...' : 'Save Progress' }}
                </Button>
                <Button size="sm" @click="handleNextStep" :disabled="isLoading">
                  {{ isLoading ? 'Saving...' : 'Next' }}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Odontogram -->
        <div v-if="stepIndex === 2">
          <OdontogramStep :isPediatric="true" />

          <div class="flex items-center justify-between mt-6">
            <Button variant="outline" size="sm" @click="prevStep()"> Back </Button>
            <div class="flex gap-2">
              <Button variant="outline" size="sm" @click="saveProgress" :disabled="isSaving">
                {{ isSaving ? 'Saving...' : 'Save Progress' }}
              </Button>
              <Button size="sm" @click="onFinalSubmit()"> Submit Treatment Plan </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
