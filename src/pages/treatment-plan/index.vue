<template>
  <div class="bg-muted/50 p-6">
    <div class="mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold mb-2">Create Treatment Plan</h1>
            <p class="text-muted-foreground">
              Follow the steps to create a comprehensive treatment plan
            </p>
          </div>

          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-3">
            <div v-if="lastSaved" class="text-sm text-gray-500 order-1">
              Last saved: {{ lastSaved.toLocaleTimeString() }}
            </div>

            <div class="flex flex-col sm:flex-row gap-2 order-2 w-full sm:w-auto">
              <!-- Remove Treatment Plan Button -->
              <Button
                @click="showRemoveConfirmation = true"
                :disabled="isLoading || isSaving || isRemoving"
                variant="destructive"
                size="sm"
                class="flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Trash2 class="w-4 h-4" />
                Remove Plan
              </Button>

              <Button
                @click="saveTreatmentPlan"
                :disabled="isSaving || isRemoving"
                class="flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <CheckCircle class="w-4 h-4" />
                {{ isSaving ? 'Saving...' : 'Save Treatment Plan' }}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Stepper -->
      <div class="mb-8">
        <div class="flex flex-col md:flex-row items-start w-full">
          <div
            v-for="(step, index) in steps"
            :key="step.id"
            class="flex md:flex-col items-center w-full md:flex-1 relative mb-4 md:mb-0"
          >
            <!-- Mobile/Tablet horizontal layout -->
            <div class="flex items-center w-full md:flex-col md:items-center">
              <!-- Step circle -->
              <button
                @click="goToStep(step.id)"
                :disabled="isLoading || isRemoving"
                :class="[
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors relative z-10 flex-shrink-0',
                  currentStep >= step.id
                    ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border-muted-foreground/20 bg-background text-muted-foreground hover:border-primary/50 hover:text-primary',
                  isLoading || isRemoving ? 'cursor-wait' : 'cursor-pointer',
                ]"
              >
                <CheckCircle v-if="currentStep > step.id" class="h-4 w-4" />
                <component v-else :is="step.icon" class="h-4 w-4" />
              </button>

              <!-- Step labels -->
              <div class="ml-4 md:ml-0 md:mt-4 text-left md:text-center flex-grow">
                <div
                  :class="[
                    'text-sm font-medium',
                    currentStep >= step.id ? 'text-primary' : 'text-muted-foreground',
                  ]"
                >
                  {{ step.title }}
                </div>
                <div
                  :class="[
                    'text-xs mt-1',
                    currentStep >= step.id ? 'text-primary/70' : 'text-muted-foreground/70',
                  ]"
                >
                  Step {{ step.id }} of {{ steps.length }}
                </div>
              </div>
            </div>

            <!-- Mobile/Tablet Connector line (Vertical) -->
            <div
              v-if="index < steps.length - 1"
              :class="[
                'absolute left-5 top-10 w-0.5 h-8 z-0 md:hidden',
                currentStep > step.id ? 'bg-primary' : 'bg-muted',
              ]"
            />

            <!-- Desktop Connector line (Horizontal) -->
            <div
              v-if="index < steps.length - 1"
              :class="[
                'hidden md:block absolute top-5 left-1/2 h-0.5 w-full z-0',
                currentStep > step.id ? 'bg-primary' : 'bg-muted',
              ]"
            />
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <Card class="mb-8">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <component :is="steps[currentStep - 1].icon" class="w-6 h-6" />
            Step {{ currentStep }}: {{ steps[currentStep - 1].title }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <!-- Step 1: Basic Information -->
          <BasicInformationStep
            v-if="currentStep === 1"
            :form-data="basicInfoData"
            @update:form-data="updateBasicInfo"
          />

          <!-- Step 2: Odontogram -->
          <OdontogramStep
            v-else-if="currentStep === 2"
            :teeth-with-procedures="teethWithProcedures"
            :isPediatric="isPediatric"
            @remove-procedure="handleRemoveProcedure"
          />

          <!-- Step 3: Measurements -->
          <MeasurementsStep
            v-else-if="currentStep === 3"
            :form-data="measurementsData"
            @update:form-data="updateMeasurements"
          />

          <!-- Step 4: Assessment -->
          <AssessmentStep
            v-else-if="currentStep === 4"
            :form-data="assessmentData"
            :assessment-questions="assessmentQuestions"
            @update:form-data="updateAssessment"
          />

          <!-- Step 5: Documents -->
          <DocumentsStep
            v-else-if="currentStep === 5"
            :uploaded-files="uploadedFiles"
            @update:uploaded-files="updateUploadedFiles"
          />

          <!-- Step 6: Review -->
          <ReviewStep
            v-else-if="currentStep === 6"
            :basic-info="basicInfoData"
            :measurements="measurementsData"
            :assessment-data="assessmentData"
            :assessment-questions="assessmentQuestions"
            :teeth-with-procedures="teethWithProcedures"
            :uploaded-files="uploadedFiles"
          />
        </CardContent>
      </Card>

      <!-- Navigation -->
      <div class="flex justify-between items-center">
        <Button
          variant="outline"
          @click="prevStep"
          :disabled="currentStep === 1 || isLoading || isRemoving"
          class="flex items-center gap-2"
        >
          <ChevronLeft class="w-4 h-4" />
          Previous
        </Button>

        <div class="flex items-center gap-2">
          <Button
            @click="saveProgress"
            :disabled="isLoading || isRemoving"
            variant="outline"
            size="sm"
          >
            <Save class="w-4 h-4 mr-2" />
            {{ isLoading ? 'Saving...' : 'Save Progress' }}
          </Button>

          <Button
            v-if="currentStep < steps.length"
            @click="nextStep"
            :disabled="isLoading || isRemoving"
            class="flex items-center gap-2"
          >
            Next
            <ChevronRight class="w-4 h-4" />
          </Button>
          <Button
            v-else
            @click="createTreatmentPlan"
            :disabled="isRemoving"
            class="flex items-center gap-2"
          >
            <CheckCircle class="w-4 h-4" />
            Create Treatment Plan
          </Button>
        </div>
      </div>
    </div>

    <!-- Remove Confirmation Dialog -->
    <AlertDialog :open="showRemoveConfirmation" @update:open="showRemoveConfirmation = $event">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle class="flex items-center gap-2">
            <AlertTriangle class="w-5 h-5 text-destructive" />
            Remove Treatment Plan
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove this treatment plan? This action cannot be undone and
            all data will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel :disabled="isRemoving">Cancel</AlertDialogCancel>
          <AlertDialogAction
            @click="removeTreatmentPlan"
            :disabled="isRemoving"
            variant="destructive"
            class="flex items-center gap-2"
          >
            <Trash2 v-if="!isRemoving" class="w-4 h-4" />
            <Loader2 v-else class="w-4 h-4 animate-spin" />
            {{ isRemoving ? 'Removing...' : 'Remove Plan' }}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide, withDefaults, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  FileText,
  User,
  Calculator,
  HelpCircle,
  FileCheck,
  Camera,
  Save,
  Trash2,
  AlertTriangle,
  Loader2,
} from 'lucide-vue-next'
import { useOdontogram } from '@/composables/odontogram/useOdontogram'
import BasicInformationStep from './steps/BasicInformationStep.vue'
import OdontogramStep from './steps/OdontogramStep.vue'
import MeasurementsStep from './steps/MeasurementsStep.vue'
import AssessmentStep from './steps/AssessmentStep.vue'
import DocumentsStep from './steps/DocumentsStep.vue'
import ReviewStep from './steps/ReviewStep.vue'

// Types
interface Procedure {
  name: string
  description?: string
  visual: {
    visualType: 'Color' | 'Pattern' | 'Icon' | 'GumShape' | 'ToothShape'
    value: string
  }
}

interface ToothWithProcedures {
  toothNumber: string
  procedures: Procedure[]
}

interface Step {
  id: number
  title: string
  icon: any
}

interface AssessmentQuestion {
  key: string
  text: string
}

interface MeasurementItem {
  label: string
  value: string
  unit: string
}

// Props (if patient ID is passed as prop)
interface Props {
  patientId?: string
}

const props = withDefaults(defineProps<Props>(), {
  patientId: '',
})

// Router for navigation
const router = useRouter()

// Reactive state
const currentStep = ref(1)
const isLoading = ref(false)
const isSaving = ref(false)
const isRemoving = ref(false)
const showRemoveConfirmation = ref(false)
const lastSaved = ref<Date | null>(null)

// Separate data objects for each step
const basicInfoData = ref({
  planName: '',
  patientType: '',
  treatmentCategory: '',
  estimatedDuration: '',
  assignedProvider: '',
  description: '',
})

const measurementsData = ref({
  dosage: '',
  frequency: '',
  duration: '',
  weight: '',
  height: '',
  targetValue: '',
  currentValue: '',
  maximumValue: '',
})

const assessmentData = ref({
  question1: '',
  question1Details: '',
  question2: '',
  question2Details: '',
  question3: '',
  question3Details: '',
  question4: '',
  question4Details: '',
})

const uploadedFiles = ref({
  medicalReports: [] as File[],
  treatmentImages: [] as File[],
})

// Use odontogram composable to sync with chart data
const isPediatric = true // or use your logic, e.g., basicInfoData.value.patientType === 'child'
const odontogram = useOdontogram(isPediatric)
provide('odontogram', odontogram)

// Compute actual procedures from teeth data (not selectedSegments)
const teethWithProcedures = computed<ToothWithProcedures[]>(() => {
  const result: ToothWithProcedures[] = []

  odontogram.teeth.value.forEach((tooth) => {
    const procedures: Procedure[] = []

    // Add tooth procedures (Tooth, Crown, Root)
    tooth.toothProcedures.forEach((assignment) => {
      procedures.push({
        name: assignment.procedure.name,
        description: `${assignment.toothPart}${assignment.position ? ` (${assignment.position})` : ''}`,
        visual: {
          visualType: assignment.procedure.visual.visualType,
          value: assignment.procedure.visual.value!,
        },
      })
    })

    // Add schema procedures (Mesial, Distal, Buccal, Lingual)
    tooth.schemaProcedures.forEach((assignment) => {
      procedures.push({
        name: assignment.procedure.name,
        description: `${assignment.surface} surface`,
        visual: {
          visualType: assignment.procedure.visual.visualType,
          value: assignment.procedure.visual.value!,
        },
      })
    })

    // Only include teeth that have procedures
    if (procedures.length > 0) {
      result.push({
        toothNumber: tooth.number,
        procedures,
      })
    }
  })

  return result
})

// Static data
const steps: Step[] = [
  { id: 1, title: 'Basic Information', icon: FileText },
  { id: 2, title: 'Odontogram', icon: User },
  { id: 3, title: 'Measurements', icon: Calculator },
  { id: 4, title: 'Assessment', icon: HelpCircle },
  { id: 5, title: 'Documents', icon: Camera },
  { id: 6, title: 'Review', icon: FileCheck },
]

const assessmentQuestions: AssessmentQuestion[] = [
  { key: 'question1', text: 'Does the patient have any allergies?' },
  { key: 'question2', text: 'Is the patient currently taking other medications?' },
  { key: 'question3', text: 'Has the patient undergone similar treatment before?' },
  { key: 'question4', text: 'Are there any mobility restrictions?' },
]

// Mock API functions
const mockApi = {
  async saveProgress(
    stepNumber: number,
    stepData: any,
  ): Promise<{ success: boolean; savedAt: string }> {
    await new Promise((resolve) => setTimeout(resolve, 800))
    console.log(`Saving progress for step ${stepNumber}:`, stepData)
    return {
      success: true,
      savedAt: new Date().toISOString(),
    }
  },

  async saveTreatmentPlan(planData: {
    basicInfo: typeof basicInfoData.value
    measurements: typeof measurementsData.value
    assessment: typeof assessmentData.value
    uploadedFiles: typeof uploadedFiles.value
    teeth: any[]
    teethWithProcedures: any[]
  }): Promise<{ success: boolean; planId: string; savedAt: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1200))
    console.log('Saving complete treatment plan:', planData)
    return {
      success: true,
      planId: `tp-${Date.now()}`,
      savedAt: new Date().toISOString(),
    }
  },

  async removeTreatmentPlan(planId?: string): Promise<{ success: boolean; removedAt: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('Removing treatment plan:', planId || 'current-plan')
    return {
      success: true,
      removedAt: new Date().toISOString(),
    }
  },
}

// Methods
const goToStep = async (stepNumber: number) => {
  if (
    stepNumber < 1 ||
    stepNumber > steps.length ||
    isLoading.value ||
    isRemoving.value ||
    stepNumber === currentStep.value
  )
    return

  // Save current progress before switching
  await saveProgress()
  currentStep.value = stepNumber
}

const nextStep = async () => {
  if (currentStep.value < steps.length && !isLoading.value && !isRemoving.value) {
    await saveProgress() // Auto-save when moving to next step
    currentStep.value++
  }
}

const prevStep = async () => {
  if (currentStep.value > 1 && !isLoading.value && !isRemoving.value) {
    await saveProgress() // Auto-save when moving to previous step
    currentStep.value--
  }
}

const saveProgress = async () => {
  if (isLoading.value || isRemoving.value) return

  isLoading.value = true
  try {
    const stepData = getStepData(currentStep.value)
    await mockApi.saveProgress(currentStep.value, stepData)
    lastSaved.value = new Date()
  } catch (error) {
    console.error('Failed to save progress:', error)
    alert('Failed to save progress. Please try again.')
  } finally {
    isLoading.value = false
  }
}

const saveTreatmentPlan = async () => {
  if (isSaving.value || isRemoving.value) return

  isSaving.value = true
  try {
    const planData = {
      basicInfo: basicInfoData.value,
      measurements: measurementsData.value,
      assessment: assessmentData.value,
      uploadedFiles: uploadedFiles.value,
      teeth: odontogram.teeth.value,
      teethWithProcedures: teethWithProcedures.value,
    }
    await mockApi.saveTreatmentPlan(planData)
    lastSaved.value = new Date()
    alert('Treatment plan saved successfully!')
  } catch (error) {
    console.error('Failed to save treatment plan:', error)
    alert('Failed to save treatment plan. Please try again.')
  } finally {
    isSaving.value = false
  }
}

const removeTreatmentPlan = async () => {
  if (isRemoving.value) return

  isRemoving.value = true
  try {
    await mockApi.removeTreatmentPlan()

    // Reset all form data
    resetAllData()

    // Close dialog and show success message
    showRemoveConfirmation.value = false
    alert('Treatment plan removed successfully!')

    // Navigate back to patient details page
    // Option 1: Use patient ID prop or route params
    if (props.patientId) {
      // If patient ID is available, navigate to specific patient
      await router.push(`/patients/${props.patientId}`)
    } else {
      // Try to get patient ID from current route params
      const currentPatientId =
        router.currentRoute.value.params.patientId || router.currentRoute.value.params.id
      if (currentPatientId) {
        await router.push(`/patients/${currentPatientId}`)
      } else {
        // Fallback: navigate to patients list or dashboard
        await router.push('/patients')
      }
    }

    // Option 2: Alternative - use browser back navigation
    // router.back()

    // Option 3: Alternative - navigate to a specific route
    // await router.push('/dashboard')
  } catch (error) {
    console.error('Failed to remove treatment plan:', error)
    alert('Failed to remove treatment plan. Please try again.')
  } finally {
    isRemoving.value = false
  }
}

const resetAllData = () => {
  // Reset all form data to initial state
  basicInfoData.value = {
    planName: '',
    patientType: '',
    treatmentCategory: '',
    estimatedDuration: '',
    assignedProvider: '',
    description: '',
  }

  measurementsData.value = {
    dosage: '',
    frequency: '',
    duration: '',
    weight: '',
    height: '',
    targetValue: '',
    currentValue: '',
    maximumValue: '',
  }

  assessmentData.value = {
    question1: '',
    question1Details: '',
    question2: '',
    question2Details: '',
    question3: '',
    question3Details: '',
    question4: '',
    question4Details: '',
  }

  uploadedFiles.value = {
    medicalReports: [],
    treatmentImages: [],
  }

  // Reset odontogram data
  odontogram.resetAllTeeth()
}

const getStepData = (stepNumber: number): any => {
  switch (stepNumber) {
    case 1:
      return {
        planName: basicInfoData.value.planName,
        patientType: basicInfoData.value.patientType,
        treatmentCategory: basicInfoData.value.treatmentCategory,
        estimatedDuration: basicInfoData.value.estimatedDuration,
        assignedProvider: basicInfoData.value.assignedProvider,
        description: basicInfoData.value.description,
      }
    case 2:
      return {
        teeth: odontogram.teeth.value,
        teethWithProcedures: teethWithProcedures.value,
      }
    case 3:
      return {
        dosage: measurementsData.value.dosage,
        frequency: measurementsData.value.frequency,
        duration: measurementsData.value.duration,
        weight: measurementsData.value.weight,
        height: measurementsData.value.height,
        targetValue: measurementsData.value.targetValue,
        currentValue: measurementsData.value.currentValue,
        maximumValue: measurementsData.value.maximumValue,
      }
    case 4:
      return {
        question1: assessmentData.value.question1,
        question1Details: assessmentData.value.question1Details,
        question2: assessmentData.value.question2,
        question2Details: assessmentData.value.question2Details,
        question3: assessmentData.value.question3,
        question3Details: assessmentData.value.question3Details,
        question4: assessmentData.value.question4,
        question4Details: assessmentData.value.question4Details,
      }
    case 5:
      return {
        medicalReports: uploadedFiles.value.medicalReports,
        treatmentImages: uploadedFiles.value.treatmentImages,
      }
    default:
      return {}
  }
}

const handleRemoveProcedure = (toothNumber: string, procedure: Procedure) => {
  const tooth = odontogram.teeth.value.find((t) => t.number === toothNumber)
  if (!tooth) return

  // Remove from toothProcedures if it matches
  const toothProcIndex = tooth.toothProcedures.findIndex(
    (assignment) =>
      assignment.procedure.name === procedure.name &&
      assignment.procedure.visual.value === procedure.visual.value,
  )

  if (toothProcIndex !== -1) {
    tooth.toothProcedures.splice(toothProcIndex, 1)
    return
  }

  // Remove from schemaProcedures if it matches
  const schemaProcIndex = tooth.schemaProcedures.findIndex(
    (assignment) =>
      assignment.procedure.name === procedure.name &&
      assignment.procedure.visual.value === procedure.visual.value,
  )

  if (schemaProcIndex !== -1) {
    tooth.schemaProcedures.splice(schemaProcIndex, 1)
  }
}

// Update methods for each step
const updateBasicInfo = (data: typeof basicInfoData.value) => {
  basicInfoData.value = data
}

const updateMeasurements = (data: typeof measurementsData.value) => {
  measurementsData.value = data
}

const updateAssessment = (data: typeof assessmentData.value) => {
  assessmentData.value = data
}

const updateUploadedFiles = (files: typeof uploadedFiles.value) => {
  uploadedFiles.value = files
}

const createTreatmentPlan = () => {
  console.log('Creating treatment plan with data:', {
    basicInfo: basicInfoData.value,
    measurements: measurementsData.value,
    assessment: assessmentData.value,
    uploadedFiles: uploadedFiles.value,
    teeth: odontogram.teeth.value,
    teethWithProcedures: teethWithProcedures.value,
  })
  // Handle treatment plan creation
}
</script>
