// composables/useOdontogram.ts
import { ref, computed } from 'vue'
import type { ToothData } from '@/types/odontogram/odontogram'
import type { ProcedureWithTarget } from '@/services/procedure/procedureApi'
import { ExtraToothDirection, ProcedureIconSource } from '@/types/odontogram/odontogram'
import { ProcedureVisualType as ProcedureVisualTypeEnum, ToothPart } from '@/types/odontogram/tooth'
import {
  getAvailableConversions,
  permanentToPrimary,
  primaryToPermanent,
} from '@/utils/toothConversion'

// Utility functions
const isEmptySlot = (toothNumber: string, isPediatric: boolean) => {
  if (!isPediatric) return false
  const permanentMolars = [16, 17, 18, 26, 27, 28, 36, 37, 38, 46, 47, 48]
  return permanentMolars.includes(parseInt(toothNumber))
}

const createTeethFromSchema = (schema: any, isPediatric: boolean) => {
  const teeth: ToothData[] = []

  // Handle both API config format and fallback schemas
  if (schema && schema.teeth) {
    // API format: { teeth: [{ number: "11" }, ...] }
    schema.teeth.forEach((toothConfig: any) => {
      teeth.push({
        number: toothConfig.number,
        toothProcedures: [],
        schemaProcedures: [],
        isEmptySlot: isEmptySlot(toothConfig.number, isPediatric),
      })
    })
  } else if (schema && schema.quadrants) {
    // Fallback format with quadrants
    schema.quadrants.forEach((quadrant: any) => {
      quadrant.teeth.forEach((toothConfig: any) => {
        teeth.push({
          number: toothConfig.number,
          toothProcedures: [],
          schemaProcedures: [],
          isEmptySlot: isEmptySlot(toothConfig.number, isPediatric),
        })
      })
    })
  }

  return teeth
}

export function getInitialPermanentTeeth(schema?: any): ToothData[] {
  // Return empty array if no schema provided - teeth will be loaded from API
  if (!schema) return []
  return createTeethFromSchema(schema, false)
}

export function getInitialPediatricTeeth(schema?: any): ToothData[] {
  // Return empty array if no schema provided - teeth will be loaded from API
  if (!schema) return []
  return createTeethFromSchema(schema, true)
}

export function createTeethFromApiConfig(apiSchema: any, isPediatric: boolean): ToothData[] {
  return createTeethFromSchema(apiSchema, isPediatric)
}

export function useOdontogram(isPediatric = false) {
  const selectedProcedure = ref<ProcedureWithTarget | null>(null)
  const search = ref('')
  const selectedSegments = ref<string[]>([])
  const selectedToothNumbers = ref<string[]>([])
  const isDeleteMode = ref(false)
  const isProcedureMissing = ref(false)

  // Initial teeth data (permanent or pediatric)
  const teeth = ref<ToothData[]>(
    isPediatric ? getInitialPediatricTeeth() : getInitialPermanentTeeth(),
  )

  // Computed quadrant filters - support mixed schemas (permanent + primary)
  const q1teeth = computed(() =>
    teeth.value.filter((t) => t.number[0] === '5' || t.number[0] === '1')
  )
  const q2teeth = computed(() =>
    teeth.value.filter((t) => t.number[0] === '6' || t.number[0] === '2')
  )
  const q3teeth = computed(() =>
    teeth.value.filter((t) => t.number[0] === '7' || t.number[0] === '3')
  )
  const q4teeth = computed(() =>
    teeth.value.filter((t) => t.number[0] === '8' || t.number[0] === '4')
  )

  // Event handlers
  const handleSegmentClick = (segmentId: string) => {
    const index = selectedSegments.value.indexOf(segmentId)
    if (index > -1) {
      selectedSegments.value.splice(index, 1)
    } else {
      selectedSegments.value.push(segmentId)
    }
  }

  const handleToothClick = (toothNumber: string) => {
    const index = selectedToothNumbers.value.indexOf(toothNumber)
    if (index > -1) {
      selectedToothNumbers.value.splice(index, 1)
    } else {
      selectedToothNumbers.value.push(toothNumber)
    }
  }

  const handleRemoveTooth = (number: string) => {
    const index = teeth.value.findIndex((t) => t.number === number)
    if (index > -1) {
      teeth.value.splice(index, 1)
    }
  }

  const handleAddExtraTooth = (base: string, direction: ExtraToothDirection) => {
    const suffix = direction === ExtraToothDirection.Before ? '-1' : '+1'
    const number = `${base}${suffix}`

    if (teeth.value.some((t) => t.number === number)) return

    const newTooth: ToothData = {
      number,
      toothProcedures: [],
      schemaProcedures: [],
    }

    const baseIndex = teeth.value.findIndex((t) => t.number === base)
    if (baseIndex === -1) return

    const quadrant = base[0]
    const isLeftSide = quadrant === '1' || quadrant === '4' || quadrant === '5' || quadrant === '8'
    const insertAt =
      (direction === ExtraToothDirection.Before) === isLeftSide ? baseIndex + 1 : baseIndex

    teeth.value.splice(insertAt, 0, newTooth)
  }

  // Use API target format directly (no more mapping needed)

  const handleProcedureSelect = (procedure: ProcedureWithTarget) => {
    // Prevent adding any procedure to a tooth that already has 'brak zęba' (HideTooth)
    const isHideToothAssigned = (tooth: ToothData) =>
      tooth.toothProcedures.some((a) => a.procedure.behavior === 'HideTooth')

    const rawTargets = procedure.targets
    if (!rawTargets) {
      console.warn(`No target mapping found for procedure: ${procedure.name}`)
      return
    }

    // Use API format directly - no mapping needed
    const targets = Array.isArray(rawTargets) ? rawTargets : [rawTargets]

    selectedToothNumbers.value.forEach((number) => {
      const tooth = teeth.value.find((t) => t.number === number)
      if (!tooth) return
      if (isHideToothAssigned(tooth) && procedure.behavior !== 'HideTooth') return // Block if 'brak zęba' is present
      if (targets.length === 1) {
        // If only one possible target, assign to it
        const singleTarget = targets[0]
        const toothPart =
          singleTarget === 'Tooth'
            ? 'Tooth'
            : singleTarget === 'Crown'
              ? 'Crown'
              : singleTarget === 'Root'
                ? 'Root'
                : null
        if (
          toothPart &&
          !tooth.toothProcedures.some(
            (a) => a.toothPart === toothPart && a.procedure.name === procedure.name,
          )
        ) {
          tooth.toothProcedures.push({
            procedure,
            toothPart: toothPart as any,
          })
        }
      } else if (targets.includes('Tooth')) {
        // If multiple targets, only assign if 'Tooth' is a valid target
        if (
          !tooth.toothProcedures.some(
            (a) => a.toothPart === 'Tooth' && a.procedure.name === procedure.name,
          )
        ) {
          tooth.toothProcedures.push({
            procedure,
            toothPart: ToothPart.Tooth,
          })
        }
      }
    })

    selectedSegments.value.forEach((segmentId) => {
      const parts = segmentId.split('_')
      const number = parts.length === 3 ? parts[1] : parts[0]
      const part = parts.length === 3 ? parts[2] : parts[1]
      const partCapitalized = part.charAt(0).toUpperCase() + part.slice(1)

      const tooth = teeth.value.find((t) => t.number === number)
      if (!tooth) return
      if (isHideToothAssigned(tooth) && procedure.behavior !== 'HideTooth') return // Block if 'brak zęba' is present

      // Handle tooth parts (Tooth, Crown, Root)
      if (
        ['Crown', 'Root', 'Tooth'].includes(partCapitalized) &&
        targets.includes(partCapitalized)
      ) {
        if (
          !tooth.toothProcedures.some(
            (a) => a.toothPart === partCapitalized && a.procedure.name === procedure.name,
          )
        ) {
          tooth.toothProcedures.push({
            procedure,
            toothPart: partCapitalized as any,
          })
        }
      }

      // Handle surfaces (with API format like MesialSurface, DistalSurface, etc.)
      const surfaceMap: { [key: string]: string } = {
        mesial: 'MesialSurface',
        distal: 'DistalSurface',
        buccal: 'BuccalSurface',
        lingual: 'LingualSurface',
        incisal: 'IncisalSurface',
        occlusal: 'OcclusalSurface',
        labial: 'LabialSurface',
        palatal: 'PalatalSurface',
      }

      const partLower = part.toLowerCase()
      const apiSurface = surfaceMap[partLower]

      if (apiSurface && targets.includes(apiSurface)) {
        if (
          !tooth.schemaProcedures.some(
            (a) => a.surface === partCapitalized && a.procedure.name === procedure.name,
          )
        ) {
          tooth.schemaProcedures.push({
            procedure,
            surface: partCapitalized as any,
          })
        }
      }
    })

    selectedProcedure.value = null
    selectedToothNumbers.value = []
    selectedSegments.value = []
  }

  // Reinitialize with API schema configuration
  const reinitializeWithSchema = (apiSchema: any, isPediatricSchema: boolean) => {
    // Use API schema to create teeth
    teeth.value = createTeethFromApiConfig(apiSchema, isPediatricSchema)

    // Clear all selections and reset state
    selectedProcedure.value = null
    selectedSegments.value = []
    selectedToothNumbers.value = []
    isDeleteMode.value = false
    isProcedureMissing.value = false
    search.value = ''
  }

  // Reset all teeth data to initial state
  const resetAllTeeth = () => {
    // Clear all procedures from existing teeth
    teeth.value.forEach((tooth) => {
      tooth.toothProcedures = []
      tooth.schemaProcedures = []
    })

    // Don't reset teeth array - keep existing teeth from API schema
    // Only clear procedures and reset UI state

    // Clear all selections and reset state
    selectedProcedure.value = null
    selectedSegments.value = []
    selectedToothNumbers.value = []
    isDeleteMode.value = false
    isProcedureMissing.value = false
    search.value = ''
  }

  // Convert selected teeth between permanent and primary
  const convertSelectedTeethToPrimary = () => {
    selectedToothNumbers.value.forEach((toothNumber) => {
      const converted = permanentToPrimary(toothNumber) // Use specific conversion function
      if (converted) {
        const tooth = teeth.value.find((t) => t.number === toothNumber)
        if (tooth) {
          // Store the original SVG ID for rendering
          const originalSvgId = tooth.number
          tooth.number = converted
          // Add mapping for SVG rendering - use original position for converted tooth
          tooth.svgId = originalSvgId
          // If it was an empty slot, make it a real tooth now
          if (tooth.isEmptySlot) {
            tooth.isEmptySlot = false
          }
        }
      }
    })
    selectedToothNumbers.value = []
  }

  const convertSelectedTeethToPermanent = () => {
    selectedToothNumbers.value.forEach((toothNumber) => {
      const converted = primaryToPermanent(toothNumber) // Use specific conversion function
      if (converted) {
        const tooth = teeth.value.find((t) => t.number === toothNumber)
        if (tooth) {
          tooth.number = converted
          // If it was an empty slot, make it a real tooth now
          if (tooth.isEmptySlot) {
            tooth.isEmptySlot = false
          }
        }
      }
    })
    selectedToothNumbers.value = []
  }

  // Convert empty slots to real teeth
  const addToothToEmptySlot = (toothNumber: string) => {
    const tooth = teeth.value.find((t) => t.number === toothNumber)
    if (tooth && tooth.isEmptySlot) {
      tooth.isEmptySlot = false
    }
  }

  // Add teeth to all selected empty slots
  const addTeethToSelectedEmptySlots = () => {
    selectedToothNumbers.value.forEach((toothNumber) => {
      addToothToEmptySlot(toothNumber)
    })
    selectedToothNumbers.value = []
  }

  // Get available conversion options for selected teeth
  const availableConversions = computed(() => {
    return getAvailableConversions(selectedToothNumbers.value)
  })

  // Convert real teeth back to empty slots
  const removeToothToEmptySlot = (toothNumber: string) => {
    const tooth = teeth.value.find((t) => t.number === toothNumber)
    const firstDigit = toothNumber[0]
    const lastDigit = toothNumber[1]

    // Allow removal of:
    // 1. Baby teeth (positions 1-5) when first digit is 5,6,7,8 (pediatric teeth)
    // 2. ALL permanent teeth (positions 1-8) when first digit is 1,2,3,4 (permanent teeth)
    const isBabyTooth =
      ['5', '6', '7', '8'].includes(firstDigit) && ['1', '2', '3', '4', '5'].includes(lastDigit)
    const isPermanentTooth =
      ['1', '2', '3', '4'].includes(firstDigit) &&
      ['1', '2', '3', '4', '5', '6', '7', '8'].includes(lastDigit)
    const isRemovablePosition = isBabyTooth || isPermanentTooth

    if (tooth && !tooth.isEmptySlot && isRemovablePosition) {
      // Clear any procedures before making it an empty slot
      tooth.toothProcedures = []
      tooth.schemaProcedures = []
      tooth.isEmptySlot = true
    }
  }

  // Remove all selected teeth (convert to empty slots)
  const removeSelectedTeeth = () => {
    selectedToothNumbers.value.forEach((toothNumber) => {
      removeToothToEmptySlot(toothNumber)
    })
    selectedToothNumbers.value = []
  }

  // Check if any selected teeth are empty slots
  const hasSelectedEmptySlots = computed(() => {
    return selectedToothNumbers.value.some((toothNumber) => {
      const tooth = teeth.value.find((t) => t.number === toothNumber)
      return tooth?.isEmptySlot === true
    })
  })

  // Check if any selected teeth are removable real teeth (baby teeth or permanent teeth, not empty slots)
  const hasSelectedRealTeeth = computed(() => {
    return selectedToothNumbers.value.some((toothNumber) => {
      const tooth = teeth.value.find((t) => t.number === toothNumber)
      const firstDigit = toothNumber[0]
      const lastDigit = toothNumber[1]

      // Same logic as removeToothToEmptySlot
      const isBabyTooth =
        ['5', '6', '7', '8'].includes(firstDigit) && ['1', '2', '3', '4', '5'].includes(lastDigit)
      const isPermanentTooth =
        ['1', '2', '3', '4'].includes(firstDigit) &&
        ['1', '2', '3', '4', '5', '6', '7', '8'].includes(lastDigit)
      const isRemovablePosition = isBabyTooth || isPermanentTooth

      return tooth && !tooth.isEmptySlot && isRemovablePosition
    })
  })

  // Count how many removable real teeth are selected
  const selectedRemovableTeethCount = computed(() => {
    return selectedToothNumbers.value.filter((toothNumber) => {
      const tooth = teeth.value.find((t) => t.number === toothNumber)
      const firstDigit = toothNumber[0]
      const lastDigit = toothNumber[1]

      // Same logic as removeToothToEmptySlot
      const isBabyTooth =
        ['5', '6', '7', '8'].includes(firstDigit) && ['1', '2', '3', '4', '5'].includes(lastDigit)
      const isPermanentTooth =
        ['1', '2', '3', '4'].includes(firstDigit) &&
        ['1', '2', '3', '4', '5', '6', '7', '8'].includes(lastDigit)
      const isRemovablePosition = isBabyTooth || isPermanentTooth

      return tooth && !tooth.isEmptySlot && isRemovablePosition
    }).length
  })

  // Function to set individual vertical offset for teeth
  const setToothVerticalOffset = (toothNumber: string, offset: number) => {
    const tooth = teeth.value.find((t) => t.number === toothNumber)
    if (tooth) {
      tooth.verticalOffset = offset
    }
  }

  // Function to reset vertical offset for teeth
  const resetToothVerticalOffset = (toothNumber: string) => {
    const tooth = teeth.value.find((t) => t.number === toothNumber)
    if (tooth) {
      tooth.verticalOffset = undefined
    }
  }

  return {
    selectedProcedure,
    search,
    selectedSegments,
    selectedToothNumbers,
    teeth,
    isDeleteMode,
    isProcedureMissing,
    q1teeth,
    q2teeth,
    q3teeth,
    q4teeth,
    handleSegmentClick,
    handleToothClick,
    handleRemoveTooth,
    handleAddExtraTooth,
    handleProcedureSelect,
    resetAllTeeth,
    reinitializeWithSchema,
    convertSelectedTeethToPrimary,
    convertSelectedTeethToPermanent,
    availableConversions,
    addToothToEmptySlot,
    addTeethToSelectedEmptySlots,
    hasSelectedEmptySlots,
    removeToothToEmptySlot,
    removeSelectedTeeth,
    hasSelectedRealTeeth,
    selectedRemovableTeethCount,
    setToothVerticalOffset,
    resetToothVerticalOffset,
    setSelectedProcedure: (procedure: ProcedureWithTarget | null) =>
      (selectedProcedure.value = procedure),
    setSearch: (value: string) => (search.value = value),
    setIsProcedureMissing: (value: boolean) => (isProcedureMissing.value = value),
  }
}
