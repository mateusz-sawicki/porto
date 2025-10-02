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
import { computed, provide, withDefaults, watch, onMounted } from 'vue'
import { useOdontogram } from '@/composables/odontogram/useOdontogram'
import Odontogram from '@/components/odontogram/Odontogram.vue'
import ToothProceduresSummary from '@/components/odontogram/ToothProcedureSummary.vue'
import { procedureConfigService } from '@/services/procedure/procedureConfigService'
import type { ToothProcedureReference, SchemaProcedureReference } from '@/types/odontogram/odontogram'
import { ExtraToothDirection } from '@/types/odontogram/odontogram'

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

// Function to get form data for API submission (teeth array format)
const getFormData = () => {
  const teethData: any[] = []

  odontogram.teeth.value.forEach((tooth) => {
    // Convert current runtime assignments to lightweight references for storage
    const toothProcedureRefs: ToothProcedureReference[] = tooth.toothProcedures.map((assignment: any) => ({
      procedureId: assignment.procedure.id,
      procedureName: assignment.procedure.name,
      toothPart: assignment.toothPart,
      position: assignment.position
    }))

    const schemaProcedureRefs: SchemaProcedureReference[] = tooth.schemaProcedures.map((assignment: any) => ({
      procedureId: assignment.procedure.id,
      procedureName: assignment.procedure.name,
      surface: assignment.surface
    }))

    if (toothProcedureRefs.length > 0 || schemaProcedureRefs.length > 0) {
      teethData.push({
        number: tooth.number,
        toothProcedureReferences: toothProcedureRefs,
        schemaProcedureReferences: schemaProcedureRefs
      })
    }
  })

  return {
    teeth: teethData
  }
}

// Function to load data from treatment plan into odontogram
const loadOdontogramData = async () => {
  // Reset odontogram to fresh state (useOdontogram already uses schemas)
  odontogram.resetAllTeeth()

  // Ensure procedure configs are loaded
  await procedureConfigService.fetchProcedureConfigs()

  if (props.treatmentPlan && props.treatmentPlan.currentStepDetail) {
    const currentStep = props.treatmentPlan.currentStepDetail

    // Check if this is the correct step for current stepIndex
    if (currentStep && currentStep.detailsStep === props.stepIndex) {
      const stepData = currentStep.detailsData

      // Load procedures data if available
      if (stepData && stepData.teeth && Array.isArray(stepData.teeth)) {
        // First pass: create missing extra teeth
        stepData.teeth.forEach((savedTooth: any) => {
          const toothNumber = savedTooth.number
          const toothExists = odontogram.teeth.value.some(t => t.number === toothNumber)

          if (!toothExists && (toothNumber.includes('-') || toothNumber.includes('+'))) {
            // Extract base tooth number and direction
            const isBeforeExtra = toothNumber.includes('-')
            const baseNumber = toothNumber.split(/[-+]/)[0]
            const direction = isBeforeExtra ? ExtraToothDirection.Before : ExtraToothDirection.After

            // Add the extra tooth using the composable function
            odontogram.handleAddExtraTooth(baseNumber, direction)
          }
        })

        // Second pass: load procedures into all teeth
        stepData.teeth.forEach((savedTooth: any) => {
          const tooth = odontogram.teeth.value.find((t) => t.number === savedTooth.number)

          if (tooth) {
            // Load tooth procedures
            if (savedTooth.toothProcedureReferences) {
              tooth.toothProcedures = savedTooth.toothProcedureReferences.map((ref: ToothProcedureReference) => ({
                procedure: procedureConfigService.resolveProcedureReference(ref.procedureId, ref.procedureName),
                toothPart: ref.toothPart,
                position: ref.position
              }))
            }

            // Load schema procedures
            if (savedTooth.schemaProcedureReferences) {
              tooth.schemaProcedures = savedTooth.schemaProcedureReferences.map((ref: SchemaProcedureReference) => ({
                procedure: procedureConfigService.resolveProcedureReference(ref.procedureId, ref.procedureName),
                surface: ref.surface
              }))
            }
          }
        })
      }
    }
  }
}

// Watch for changes in treatment plan data
watch(() => props.treatmentPlan, (plan) => {
  if (plan && plan.currentStepDetail) {
    loadOdontogramData()
  }
}, { deep: true, immediate: true })

// Initialize procedure configurations on mount
onMounted(async () => {
  await procedureConfigService.fetchProcedureConfigs()
})

// Expose methods to parent component
defineExpose({
  getFormData,
})
</script>
