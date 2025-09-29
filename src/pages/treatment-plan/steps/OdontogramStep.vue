<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 gap-6">
      <!-- Odontogram Component (chart + controls) -->
      <Odontogram :isPediatric="props.isPediatric" />

      <!-- Procedures Summary -->
      <div>
        <ToothProceduresSummary
          :teeth-with-procedures="teethWithProcedures"
          @remove-procedure="handleRemoveProcedure"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, withDefaults, watch } from 'vue'
import { useOdontogram } from '@/composables/odontogram/useOdontogram'
import Odontogram from '@/components/odontogram/Odontogram.vue'
import ToothProceduresSummary from '@/components/odontogram/ToothProcedureSummary.vue'

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

interface Props {
  isPediatric?: boolean
  treatmentPlan?: any
  stepIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  isPediatric: true,
})

// Use odontogram composable to sync with chart data
const odontogram = useOdontogram(props.isPediatric)
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

// Function to get form data for API submission
const getFormData = () => {
  return {
    teeth: odontogram.teeth.value,
    teethWithProcedures: teethWithProcedures.value,
  }
}

// Function to load data from treatment plan into odontogram
const loadOdontogramData = () => {
  if (props.treatmentPlan && props.treatmentPlan.currentStepDetail) {
    const currentStep = props.treatmentPlan.currentStepDetail

    // Check if this is the correct step for current stepIndex
    if (currentStep && currentStep.detailsStep === props.stepIndex) {
      const stepData = currentStep.detailsData
      console.log('Loading odontogram data:', stepData)

      // Load teeth data if available
      if (stepData && stepData.teeth && Array.isArray(stepData.teeth)) {
        odontogram.teeth.value = stepData.teeth
        console.log('Loaded teeth data into odontogram')
      }
    } else {
      console.log('No data for current step, using empty odontogram')
    }
  }
}

// Watch for changes in treatment plan data
watch(() => props.treatmentPlan, (plan) => {
  if (plan && plan.currentStepDetail) {
    loadOdontogramData()
  }
}, { deep: true, immediate: true })

// Expose methods to parent component
defineExpose({
  getFormData,
})
</script>
