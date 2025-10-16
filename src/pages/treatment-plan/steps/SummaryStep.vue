<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import MedicalInterviewStep from './MedicalInterviewStep.vue'
import OdontogramStep from './OdontogramStep.vue'
import IntraoralExaminationStep from './IntraoralExaminationStep.vue'
import MeasurementsStep from './MeasurementsStep.vue'

interface Props {
  treatmentPlan: any
  allStepsData?: Record<string, any>
  stepIndex: number
  isLoading?: boolean
  onNext: (data: any) => void
}

const props = defineProps<Props>()

const allStepsData = ref<any>({})

// Aggregate data from all previous steps
const aggregatedData = computed(() => {
  // Use data from treatmentPlan.currentStepDetails.detailsData if available
  const detailsData = props.treatmentPlan?.currentStepDetails?.detailsData

  if (detailsData) {
    return {
      medicalInterview: detailsData.MedicalInterview || {},
      odontogram: detailsData.Odontogram || {},
      measurements: detailsData.Measurements || {},
      intraoralExamination: detailsData.IntraoralExamination || {}
    }
  }

  // Fallback to allStepsData prop for backward compatibility
  return {
    medicalInterview: props.allStepsData?.medicalInterview || {},
    odontogram: props.allStepsData?.odontogram || {},
    measurements: props.allStepsData?.measurements || {},
    intraoralExamination: props.allStepsData?.intraoralExamination || {}
  }
})

// Summary statistics from measurements
const measurementsSummary = computed(() => {
  const measurements = aggregatedData.value.measurements
  if (!measurements || Object.keys(measurements).length === 0) return null

  const scores = Object.entries(measurements)
    .filter(([key, value]) => typeof value === 'string' && !isNaN(Number(value)))
    .map(([key, value]) => ({ key, value: Number(value) }))

  if (scores.length === 0) return null

  const total = scores.reduce((sum, item) => sum + item.value, 0)
  const average = (total / scores.length).toFixed(1)
  const highest = Math.max(...scores.map(s => s.value))
  const lowest = Math.min(...scores.map(s => s.value))

  return {
    scores,
    average,
    highest,
    lowest,
    total
  }
})

// Get numeric field labels
const getNumericFieldLabel = (key: string): string => {
  const labels: Record<string, string> = {
    painLevel: 'Poziom bólu',
    comfortLevel: 'Poziom komfortu',
    functionalityLevel: 'Funkcjonalność',
    aestheticsLevel: 'Estetyka',
    occlusionLevel: 'Okluzja',
    hygieneAbility: 'Możliwość utrzymania higieny',
    mobilityLevel: 'Ruchomość szczęki',
    stabilityLevel: 'Stabilność uzębienia',
    symmetryLevel: 'Symetria twarzy',
    overallSatisfaction: 'Ogólne zadowolenie'
  }
  return labels[key] || key
}

// Get color for numeric score
const getScoreColor = (score: number): string => {
  if (score >= 8) return 'bg-green-100 text-green-800'
  if (score >= 6) return 'bg-yellow-100 text-yellow-800'
  if (score >= 4) return 'bg-orange-100 text-orange-800'
  return 'bg-red-100 text-red-800'
}

// Count filled fields in medical interview
const medicalInterviewSummary = computed(() => {
  const data = aggregatedData.value.medicalInterview
  if (!data || Object.keys(data).length === 0) return { filledCount: 0, totalFields: 0 }

  const filledFields = Object.entries(data).filter(([key, value]) => {
    return value === true || (typeof value === 'string' && value.trim() !== '') ||
           (value !== null && value !== undefined && value !== false && value !== '')
  })

  return {
    filledCount: filledFields.length,
    totalFields: Object.keys(data).length,
    completionRate: Object.keys(data).length > 0 ? ((filledFields.length / Object.keys(data).length) * 100).toFixed(0) : 0
  }
})

// Format medical interview data for display
const formatMedicalData = (data: any) => {
  if (!data || Object.keys(data).length === 0) return []

  return Object.entries(data)
    .filter(([key, value]) => {
      return value === true || (typeof value === 'string' && value.trim() !== '') ||
             (value !== null && value !== undefined && value !== false && value !== '')
    })
    .map(([key, value]) => ({ key, value }))
    .slice(0, 10) // Show first 10 filled fields
}

function handleNextStep() {
  // For readonly summary, just pass empty data
  props.onNext({})
}

function getFormData() {
  // For readonly summary, return empty object
  return {}
}

defineExpose({
  getFormData,
  handleNextStep,
})

// Get configuration for each step from Summary config
const stepConfigurations = computed(() => {
  const summaryConfig = props.treatmentPlan?.currentStepConfig

  return {
    medicalInterview: summaryConfig?.MedicalInterview || null,
    odontogram: summaryConfig?.Odontogram || null,
    intraoralExamination: summaryConfig?.IntraoralExamination || null,
    measurements: summaryConfig?.Measurements || null
  }
})

// Create treatment plan objects for each step component
const createStepTreatmentPlan = (stepName: string, config: any, data: any) => {
  return {
    ...props.treatmentPlan,
    currentStepConfig: config,
    currentStepDetails: {
      detailsStep: 0, // Always 0 for readonly view
      detailsData: data
    }
  }
}

const medicalInterviewTreatmentPlan = computed(() =>
  createStepTreatmentPlan('MedicalInterview',
    stepConfigurations.value.medicalInterview,
    aggregatedData.value.medicalInterview)
)

const odontogramTreatmentPlan = computed(() =>
  createStepTreatmentPlan('Odontogram',
    stepConfigurations.value.odontogram,
    aggregatedData.value.odontogram)
)

const intraoralExaminationTreatmentPlan = computed(() =>
  createStepTreatmentPlan('IntraoralExamination',
    stepConfigurations.value.intraoralExamination,
    aggregatedData.value.intraoralExamination)
)

const measurementsTreatmentPlan = computed(() =>
  createStepTreatmentPlan('Measurements',
    stepConfigurations.value.measurements,
    aggregatedData.value.measurements)
)

onMounted(() => {
  // Log both sources of data for debugging
  console.log('Summary step mounted with allStepsData:', props.allStepsData)
  console.log('Summary step mounted with treatmentPlan data:', props.treatmentPlan?.currentStepDetails?.detailsData)
  console.log('Summary step configurations:', stepConfigurations.value)
})
</script>

<template>
  <div class="space-y-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Podsumowanie planu leczenia</h2>
      <p class="text-gray-600">Przegląd wszystkich zebranych informacji</p>
    </div>

    <!-- Medical Interview Step -->
    <Card v-if="stepConfigurations.medicalInterview">
      <CardHeader>
        <CardTitle class="flex items-center justify-between">
          Wywiad medyczny
          <Badge variant="outline">
            {{ medicalInterviewSummary.filledCount }} / {{ medicalInterviewSummary.totalFields }} pól
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="pointer-events-none">
          <MedicalInterviewStep
            :treatment-plan="medicalInterviewTreatmentPlan"
            :step-index="0"
            :on-next="() => {}"
          />
        </div>
      </CardContent>
    </Card>

    <!-- Odontogram Step -->
    <Card v-if="stepConfigurations.odontogram">
      <CardHeader>
        <CardTitle>Odontogram</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="pointer-events-none">
          <OdontogramStep
            :treatment-plan="odontogramTreatmentPlan"
            :step-index="0"
            :is-pediatric="props.treatmentPlan?.isPediatric || false"
          />
        </div>
      </CardContent>
    </Card>

    <!-- Intraoral Examination Step -->
    <Card v-if="stepConfigurations.intraoralExamination">
      <CardHeader>
        <CardTitle>Badanie wewnątrzustne</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="pointer-events-none">
          <IntraoralExaminationStep
            :treatment-plan="intraoralExaminationTreatmentPlan"
            :step-index="0"
            :on-next="() => {}"
          />
        </div>
      </CardContent>
    </Card>

    <!-- Measurements Step -->
    <Card v-if="stepConfigurations.measurements">
      <CardHeader>
        <CardTitle>Pomiary</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="pointer-events-none">
          <MeasurementsStep
            :treatment-plan="measurementsTreatmentPlan"
            :step-index="0"
            :on-next="() => {}"
          />
        </div>
      </CardContent>
    </Card>

    <!-- Overall Summary -->
    <Card>
      <CardHeader>
        <CardTitle>Podsumowanie ogólne</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="p-4 border rounded-lg text-center">
            <h4 class="font-medium text-gray-900 mb-2">Wywiad medyczny</h4>
            <Badge :variant="medicalInterviewSummary.filledCount > 0 ? 'default' : 'secondary'">
              {{ medicalInterviewSummary.filledCount > 0 ? 'Wypełniony' : 'Pusty' }}
            </Badge>
          </div>
          <div class="p-4 border rounded-lg text-center">
            <h4 class="font-medium text-gray-900 mb-2">Odontogram</h4>
            <Badge :variant="(aggregatedData.odontogram?.teeth && aggregatedData.odontogram.teeth.length > 0) ? 'default' : 'secondary'">
              {{ (aggregatedData.odontogram?.teeth && aggregatedData.odontogram.teeth.length > 0) ? 'Zapisany' : 'Pusty' }}
            </Badge>
          </div>
          <div class="p-4 border rounded-lg text-center">
            <h4 class="font-medium text-gray-900 mb-2">Badanie wewnątrzustne</h4>
            <Badge :variant="aggregatedData.intraoralExamination && Object.keys(aggregatedData.intraoralExamination).length > 0 ? 'default' : 'secondary'">
              {{ aggregatedData.intraoralExamination && Object.keys(aggregatedData.intraoralExamination).length > 0 ? 'Wypełniony' : 'Pusty' }}
            </Badge>
          </div>
          <div class="p-4 border rounded-lg text-center">
            <h4 class="font-medium text-gray-900 mb-2">Pomiary</h4>
            <Badge :variant="measurementsSummary ? 'default' : 'secondary'">
              {{ measurementsSummary ? 'Wypełniony' : 'Pusty' }}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>