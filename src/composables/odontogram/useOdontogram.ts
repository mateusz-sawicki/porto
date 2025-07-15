// composables/useOdontogram.ts
import { ref, computed } from 'vue'
import type { ToothData, Procedure, ProcedureTargetMap } from '@/types/odontogram/odontogram'
import { ExtraToothDirection } from '@/types/odontogram/odontogram'

export function useOdontogram() {
  const selectedProcedure = ref<Procedure | null>(null)
  const search = ref('')
  const selectedSegments = ref<string[]>([])
  const selectedToothNumbers = ref<string[]>([])
  const isDeleteMode = ref(false)
  const isProcedureMissing = ref(false)

  // Initial teeth data (32 permanent teeth)
  const teeth = ref<ToothData[]>([
    // Quadrant 1 (Upper Right)
    { number: '18', toothProcedures: [], schemaProcedures: [] },
    { number: '17', toothProcedures: [], schemaProcedures: [] },
    { number: '16', toothProcedures: [], schemaProcedures: [] },
    { number: '15', toothProcedures: [], schemaProcedures: [] },
    { number: '14', toothProcedures: [], schemaProcedures: [] },
    { number: '13', toothProcedures: [], schemaProcedures: [] },
    { number: '12', toothProcedures: [], schemaProcedures: [] },
    { number: '11', toothProcedures: [], schemaProcedures: [] },
    // Quadrant 2 (Upper Left)
    { number: '21', toothProcedures: [], schemaProcedures: [] },
    { number: '22', toothProcedures: [], schemaProcedures: [] },
    { number: '23', toothProcedures: [], schemaProcedures: [] },
    { number: '24', toothProcedures: [], schemaProcedures: [] },
    { number: '25', toothProcedures: [], schemaProcedures: [] },
    { number: '26', toothProcedures: [], schemaProcedures: [] },
    { number: '27', toothProcedures: [], schemaProcedures: [] },
    { number: '28', toothProcedures: [], schemaProcedures: [] },
    // Quadrant 4 (Lower Right)
    { number: '48', toothProcedures: [], schemaProcedures: [] },
    { number: '47', toothProcedures: [], schemaProcedures: [] },
    { number: '46', toothProcedures: [], schemaProcedures: [] },
    { number: '45', toothProcedures: [], schemaProcedures: [] },
    { number: '44', toothProcedures: [], schemaProcedures: [] },
    { number: '43', toothProcedures: [], schemaProcedures: [] },
    { number: '42', toothProcedures: [], schemaProcedures: [] },
    { number: '41', toothProcedures: [], schemaProcedures: [] },
    // Quadrant 3 (Lower Left)
    { number: '31', toothProcedures: [], schemaProcedures: [] },
    { number: '32', toothProcedures: [], schemaProcedures: [] },
    { number: '33', toothProcedures: [], schemaProcedures: [] },
    { number: '34', toothProcedures: [], schemaProcedures: [] },
    { number: '35', toothProcedures: [], schemaProcedures: [] },
    { number: '36', toothProcedures: [], schemaProcedures: [] },
    { number: '37', toothProcedures: [], schemaProcedures: [] },
    { number: '38', toothProcedures: [], schemaProcedures: [] },
  ])

  // Computed quadrant filters
  const q1teeth = computed(() => teeth.value.filter((t) => t.number[0] === '1'))
  const q2teeth = computed(() => teeth.value.filter((t) => t.number[0] === '2'))
  const q3teeth = computed(() => teeth.value.filter((t) => t.number[0] === '3'))
  const q4teeth = computed(() => teeth.value.filter((t) => t.number[0] === '4'))

  // Static procedure target mapping
  const procedureTargetMap = computed(
    (): ProcedureTargetMap => ({
      Korona: 'Crown',
      'Leczenie kanałowe': 'Root',
      Ekstrakcja: 'Tooth',
      Wypełnienie: ['Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      Próchnica: ['Root', 'Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      Recesja: 'Tooth',
      Implant: 'Tooth',
      'brak zęba': 'Tooth',
      'tylko korzeń': 'Tooth',
      'Ząb zatrzymany': 'Tooth', // 🎯 NEW: Impacted tooth targets whole tooth
      Obserwacja: ['Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'], // 🎯 NEW: Observation targets all parts
      Ruchomość: ['Tooth', 'Crown', 'Root', 'Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      XD: ['Tooth', 'Crown', 'Root', 'Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      XD1: ['Tooth', 'Crown', 'Root', 'Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      XD2: ['Tooth', 'Crown', 'Root', 'Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      XD3: ['Tooth', 'Crown', 'Root', 'Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      XD4: ['Tooth', 'Crown', 'Root', 'Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
    }),
  )

  // Static procedure palette
  const procedurePalette = computed<Procedure[]>(() => [
    {
      name: 'Wypełnienie',
      behavior: 'None',
      visual: { visualType: 'Color', value: '#3b82f6' },
    },
    {
      name: 'Ekstrakcja',
      behavior: 'CrossOutTooth',
      visual: { visualType: 'Icon', value: 'X' },
    },
    {
      name: 'Leczenie kanałowe',
      behavior: 'None',
      visual: { visualType: 'Color', value: '#ef4444' },
    },
    {
      name: 'Korona',
      behavior: 'None',
      visual: { visualType: 'Color', value: '#eab308' },
    },
    {
      name: 'Próchnica',
      behavior: 'None',
      visual: { visualType: 'Color', value: '#ec4899' },
    },
    {
      name: 'Recesja',
      behavior: 'None',
      visual: { visualType: 'GumShape', value: '#000000' },
    },
    {
      name: 'Implant',
      behavior: 'Implant',
      visual: { visualType: 'Color', value: '#9a9a9a' },
    },
    {
      name: 'brak zęba',
      behavior: 'HideTooth',
      visual: { visualType: 'Icon', value: 'Ø' },
    },
    {
      name: 'tylko korzeń',
      behavior: 'RootOnly',
      visual: { visualType: 'Icon', value: 'R' },
    },
    // 🎯 NEW: Impacted tooth procedure
    {
      name: 'Ząb zatrzymany',
      behavior: 'ImpactedTooth',
      visual: { visualType: 'Icon', value: '↓' },
    },
    // 🎯 NEW: Observation procedure
    {
      name: 'Obserwacja',
      behavior: 'None',
      visual: { visualType: 'Icon', value: 'Eye' }, // Lucide icon name
    },
    // Example for future: Ruchomość (mobility) with ArrowLeftRight icon, root only
    {
      name: 'Ruchomość',
      behavior: 'None',
      visual: { visualType: 'Icon', value: 'ArrowLeftRight' },
    },
    {
      name: 'XD',
      behavior: 'None',
      visual: { visualType: 'Icon', value: 'ArrowLeftRight' },
    },
    {
      name: 'XD1',
      behavior: 'None',
      visual: { visualType: 'Icon', value: 'ArrowLeftRight' },
    },
    {
      name: 'XD2',
      behavior: 'None',
      visual: { visualType: 'Icon', value: 'ArrowLeftRight' },
    },
    {
      name: 'XD3',
      behavior: 'None',
      visual: { visualType: 'Icon', value: 'ArrowLeftRight' },
    },
    {
      name: 'XD4',
      behavior: 'None',
      visual: { visualType: 'Icon', value: 'ArrowLeftRight' },
    },
  ])

  // Helper function to safely get procedure target
  const getProcedureTarget = (procedureName: string): string | string[] | undefined => {
    return procedureTargetMap.value[procedureName]
  }

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
    const isLeftSide = quadrant === '1' || quadrant === '4'
    const insertAt =
      (direction === ExtraToothDirection.Before) === isLeftSide ? baseIndex + 1 : baseIndex

    teeth.value.splice(insertAt, 0, newTooth)
  }

  const handleProcedureSelect = (procedure: Procedure) => {
    // Prevent adding any procedure to a tooth that already has 'brak zęba' (HideTooth)
    const isHideToothAssigned = (tooth: ToothData) =>
      tooth.toothProcedures.some((a) => a.procedure.behavior === 'HideTooth')

    const target = getProcedureTarget(procedure.name)
    if (!target) {
      console.warn(`No target mapping found for procedure: ${procedure.name}`)
      return
    }

    const targets = Array.isArray(target)
      ? target.map((t) => t.toLowerCase())
      : [target.toLowerCase()]

    // Only assign to toothProcedures if allowed targets include a tooth-level part
    const toothLevelParts = ['tooth', 'crown', 'root']
    const allowedToothParts = targets.filter(t => toothLevelParts.includes(t))
    if (allowedToothParts.length > 0) {
      selectedToothNumbers.value.forEach((number) => {
        const tooth = teeth.value.find((t) => t.number === number)
        if (!tooth) return
        if (isHideToothAssigned(tooth) && procedure.behavior !== 'HideTooth') return // Block if 'brak zęba' is present
        const part = allowedToothParts[0]
        if (
          !tooth.toothProcedures.some(
            (a) => a.toothPart.toLowerCase() === part && a.procedure.name === procedure.name,
          )
        ) {
          tooth.toothProcedures.push({
            procedure,
            toothPart: (part.charAt(0).toUpperCase() + part.slice(1)) as any,
          })
        }
      })
    }

    selectedSegments.value.forEach((segmentId) => {
      const parts = segmentId.split('_')
      const number = parts.length === 3 ? parts[1] : parts[0]
      const part = parts.length === 3 ? parts[2] : parts[1]
      const partLower = part.toLowerCase()

      const tooth = teeth.value.find((t) => t.number === number)
      if (!tooth) return
      if (isHideToothAssigned(tooth) && procedure.behavior !== 'HideTooth') return // Block if 'brak zęba' is present
      if (['crown', 'root', 'tooth'].includes(partLower) && targets.includes(partLower)) {
        if (
          !tooth.toothProcedures.some(
            (a) => a.toothPart.toLowerCase() === partLower && a.procedure.name === procedure.name,
          )
        ) {
          tooth.toothProcedures.push({
            procedure,
            toothPart: (partLower.charAt(0).toUpperCase() + partLower.slice(1)) as any,
          })
        }
      }

      if (
        ['mesial', 'distal', 'buccal', 'lingual', 'incisal'].includes(partLower) &&
        targets.includes(partLower)
      ) {
        if (
          !tooth.schemaProcedures.some(
            (a) => a.surface.toLowerCase() === partLower && a.procedure.name === procedure.name,
          )
        ) {
          tooth.schemaProcedures.push({
            procedure,
            surface: (partLower.charAt(0).toUpperCase() + partLower.slice(1)) as any,
          })
        }
      }
    })

    selectedProcedure.value = null
    selectedToothNumbers.value = []
    selectedSegments.value = []
  }

  // Reset all teeth data to initial state
  const resetAllTeeth = () => {
    // Clear all procedures from existing teeth
    teeth.value.forEach((tooth) => {
      tooth.toothProcedures = []
      tooth.schemaProcedures = []
    })

    // Reset to original 32 permanent teeth (in case extra teeth were added)
    teeth.value = [
      // Quadrant 1 (Upper Right)
      { number: '18', toothProcedures: [], schemaProcedures: [] },
      { number: '17', toothProcedures: [], schemaProcedures: [] },
      { number: '16', toothProcedures: [], schemaProcedures: [] },
      { number: '15', toothProcedures: [], schemaProcedures: [] },
      { number: '14', toothProcedures: [], schemaProcedures: [] },
      { number: '13', toothProcedures: [], schemaProcedures: [] },
      { number: '12', toothProcedures: [], schemaProcedures: [] },
      { number: '11', toothProcedures: [], schemaProcedures: [] },
      // Quadrant 2 (Upper Left)
      { number: '21', toothProcedures: [], schemaProcedures: [] },
      { number: '22', toothProcedures: [], schemaProcedures: [] },
      { number: '23', toothProcedures: [], schemaProcedures: [] },
      { number: '24', toothProcedures: [], schemaProcedures: [] },
      { number: '25', toothProcedures: [], schemaProcedures: [] },
      { number: '26', toothProcedures: [], schemaProcedures: [] },
      { number: '27', toothProcedures: [], schemaProcedures: [] },
      { number: '28', toothProcedures: [], schemaProcedures: [] },
      // Quadrant 4 (Lower Right)
      { number: '48', toothProcedures: [], schemaProcedures: [] },
      { number: '47', toothProcedures: [], schemaProcedures: [] },
      { number: '46', toothProcedures: [], schemaProcedures: [] },
      { number: '45', toothProcedures: [], schemaProcedures: [] },
      { number: '44', toothProcedures: [], schemaProcedures: [] },
      { number: '43', toothProcedures: [], schemaProcedures: [] },
      { number: '42', toothProcedures: [], schemaProcedures: [] },
      { number: '41', toothProcedures: [], schemaProcedures: [] },
      // Quadrant 3 (Lower Left)
      { number: '31', toothProcedures: [], schemaProcedures: [] },
      { number: '32', toothProcedures: [], schemaProcedures: [] },
      { number: '33', toothProcedures: [], schemaProcedures: [] },
      { number: '34', toothProcedures: [], schemaProcedures: [] },
      { number: '35', toothProcedures: [], schemaProcedures: [] },
      { number: '36', toothProcedures: [], schemaProcedures: [] },
      { number: '37', toothProcedures: [], schemaProcedures: [] },
      { number: '38', toothProcedures: [], schemaProcedures: [] },
    ]

    // Clear all selections and reset state
    selectedProcedure.value = null
    selectedSegments.value = []
    selectedToothNumbers.value = []
    isDeleteMode.value = false
    isProcedureMissing.value = false
    search.value = ''

    console.log('All teeth data has been reset to initial state')
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
    procedureTargetMap,
    procedurePalette,
    handleSegmentClick,
    handleToothClick,
    handleRemoveTooth,
    handleAddExtraTooth,
    handleProcedureSelect,
    resetAllTeeth,
    setSelectedProcedure: (procedure: Procedure | null) => (selectedProcedure.value = procedure),
    setSearch: (value: string) => (search.value = value),
    setIsProcedureMissing: (value: boolean) => (isProcedureMissing.value = value),
  }
}
