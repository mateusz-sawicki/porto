// composables/useOdontogram.ts
import { ref, computed } from 'vue'
import type { ToothData, Procedure, ProcedureTargetMap } from '@/types/odontogram/odontogram'
import type { ProcedureWithTarget } from '@/services/procedure/procedureApi'
import { ExtraToothDirection, ProcedureIconSource } from '@/types/odontogram/odontogram'

export function getInitialPermanentTeeth(): ToothData[] {
  return [
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
}

export function getInitialPediatricTeeth(): ToothData[] {
  const numbers = [
    // Quadrant 5 (Upper Right)
    '55', '54', '53', '52', '51',
    // Quadrant 6 (Upper Left)
    '61', '62', '63', '64', '65',
    // Quadrant 8 (Lower Right)
    '85', '84', '83', '82', '81',
    // Quadrant 7 (Lower Left)
    '71', '72', '73', '74', '75',
  ];
  const teeth = numbers.map(n => ({ number: n, toothProcedures: [], schemaProcedures: [] })) as ToothData[];

  // Add empty slots for 6,7,8 in each quadrant (gum only, no label, no tooth)
  // Quadrant 5 (Upper Right): 56, 57, 58
  teeth.push({ number: '56', toothProcedures: [], schemaProcedures: [], isEmptySlot: true });
  teeth.push({ number: '57', toothProcedures: [], schemaProcedures: [], isEmptySlot: true });
  teeth.push({ number: '58', toothProcedures: [], schemaProcedures: [], isEmptySlot: true });
  // Quadrant 6 (Upper Left): 66, 67, 68
  teeth.push({ number: '66', toothProcedures: [], schemaProcedures: [], isEmptySlot: true });
  teeth.push({ number: '67', toothProcedures: [], schemaProcedures: [], isEmptySlot: true });
  teeth.push({ number: '68', toothProcedures: [], schemaProcedures: [], isEmptySlot: true });
  // Quadrant 8 (Lower Right): 86, 87, 88
  teeth.push({ number: '86', toothProcedures: [], schemaProcedures: [], isEmptySlot: true });
  teeth.push({ number: '87', toothProcedures: [], schemaProcedures: [], isEmptySlot: true });
  teeth.push({ number: '88', toothProcedures: [], schemaProcedures: [], isEmptySlot: true });
  // Quadrant 7 (Lower Left): 76, 77, 78
  teeth.push({ number: '76', toothProcedures: [], schemaProcedures: [], isEmptySlot: true });
  teeth.push({ number: '77', toothProcedures: [], schemaProcedures: [], isEmptySlot: true });
  teeth.push({ number: '78', toothProcedures: [], schemaProcedures: [], isEmptySlot: true });

  return teeth;
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
    isPediatric ? getInitialPediatricTeeth() : getInitialPermanentTeeth()
  )

  // Computed quadrant filters
  const q1teeth = computed(() =>
    isPediatric
      ? teeth.value.filter((t) => t.number[0] === '5')
      : teeth.value.filter((t) => t.number[0] === '1')
  )
  const q2teeth = computed(() =>
    isPediatric
      ? teeth.value.filter((t) => t.number[0] === '6')
      : teeth.value.filter((t) => t.number[0] === '2')
  )
  const q3teeth = computed(() =>
    isPediatric
      ? teeth.value.filter((t) => t.number[0] === '7')
      : teeth.value.filter((t) => t.number[0] === '3')
  )
  const q4teeth = computed(() =>
    isPediatric
      ? teeth.value.filter((t) => t.number[0] === '8')
      : teeth.value.filter((t) => t.number[0] === '4')
  )

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
      'Brak zęba': 'Tooth',
      'tylko korzeń': 'Tooth',
      'Ząb zatrzymany': 'Tooth', // 🎯 NEW: Impacted tooth targets whole tooth
      Obserwacja: ['Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'], // 🎯 NEW: Observation targets all parts
      Ruchomość: ['Tooth', 'Crown', 'Root', 'Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      XD: ['Tooth', 'Crown', 'Root', 'Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      XD1: ['Tooth', 'Crown', 'Root', 'Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      XD2: ['Tooth', 'Crown', 'Root', 'Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      XD3: ['Tooth', 'Crown', 'Root', 'Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      XD4: ['Tooth', 'Crown', 'Root', 'Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      Starcie: ['Tooth', 'Crown', 'Root', 'Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      'Ubytek klinowy': ['Tooth'],
    }),
  )

  // Static procedure palette
  const procedurePalette = computed<ProcedureWithTarget[]>(() => [
    {
      name: 'Wypełnienie',
      behavior: 'None',
      visual: { visualType: 'Color', value: '#3b82f6' },
      targets: ['Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      category: 'Restorative',
      description: 'Dental filling procedure for cavities and tooth restoration',
      isActive: true,
    },
    {
      name: 'Ekstrakcja',
      behavior: 'CrossOutTooth',
      visual: { visualType: 'ToothShape', value: 'X' },
      targets: 'Tooth',
      category: 'Surgical',
      description: 'Tooth extraction procedure',
      isActive: true,
    },
    {
      name: 'Leczenie kanałowe',
      behavior: 'None',
      visual: { visualType: 'Color', value: '#ef4444' },
      targets: 'Root',
      category: 'Endodontic',
      description: 'Root canal treatment procedure',
      isActive: true,
    },
    {
      name: 'Korona',
      behavior: 'None',
      visual: { visualType: 'Color', value: '#eab308' },
      targets: 'Crown',
      category: 'Restorative',
      description: 'Dental crown placement for tooth protection and restoration',
      isActive: true,
    },
    {
      name: 'Próchnica',
      behavior: 'None',
      visual: { visualType: 'Color', value: '#ec4899' },
      targets: ['Root', 'Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      category: 'Diagnostic',
      description: 'Caries detection and marking',
      isActive: true,
    },
    {
      name: 'Recesja',
      behavior: 'None',
      visual: { visualType: 'GumShape', value: '#000000' },
      targets: 'Tooth',
      category: 'Periodontal',
      description: 'Gum recession marking',
      isActive: true,
    },
    {
      name: 'Implant',
      behavior: 'Implant',
      visual: { visualType: 'Color', value: '#9a9a9a' },
      targets: 'Tooth',
      category: 'Surgical',
      description: 'Dental implant placement',
      isActive: true,
    },
    {
      name: 'Brak zęba',
      behavior: 'HideTooth',
      visual: { visualType: 'ToothShape', value: 'Ø' },
      targets: 'Tooth',
      category: 'Diagnostic',
      description: 'Missing tooth marking',
      isActive: true,
    },
    {
      name: 'tylko korzeń',
      behavior: 'RootOnly',
      visual: { visualType: 'Icon', value: 'R' },
      targets: 'Tooth',
      category: 'Diagnostic',
      description: 'Root only tooth marking',
      isActive: true,
    },
    // 🎯 NEW: Impacted tooth procedure
    {
      name: 'Ząb zatrzymany',
      behavior: 'ImpactedTooth',
      visual: { visualType: 'Icon', value: '↓' },
      targets: 'Tooth',
      category: 'Diagnostic',
      description: 'Impacted tooth marking',
      isActive: true,
    },
    // 🎯 NEW: Observation procedure
    {
      name: 'Obserwacja',
      behavior: 'None',
      visual: { visualType: 'Icon', value: 'Eye', iconSource: ProcedureIconSource.Lucide },
      targets: ['Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      category: 'Diagnostic',
      description: 'Observation marking for monitoring',
      isActive: true,
    },
    // Example for future: Ruchomość (mobility) with ArrowLeftRight icon, root only
    {
      name: 'Ruchomość',
      behavior: 'None',
      visual: {
        visualType: 'Icon',
        value: 'ArrowLeftRight',
        iconSource: ProcedureIconSource.Lucide,
      },
      targets: ['Tooth', 'Crown', 'Root', 'Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      category: 'Diagnostic',
      description: 'Tooth mobility assessment',
      isActive: true,
    },
    {
      name: 'XD',
      behavior: 'None',
      visual: {
        visualType: 'Icon',
        value: 'ArrowLeftRight',
        iconSource: ProcedureIconSource.Lucide,
      },
      targets: ['Tooth', 'Crown', 'Root', 'Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      category: 'Diagnostic',
      description: 'Diagnostic procedure XD',
      isActive: true,
    },
    {
      name: 'XD1',
      behavior: 'None',
      visual: {
        visualType: 'Icon',
        value: 'ArrowLeftRight',
        iconSource: ProcedureIconSource.Lucide,
      },
      targets: ['Tooth', 'Crown', 'Root', 'Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      category: 'Diagnostic',
      description: 'Diagnostic procedure XD1',
      isActive: true,
    },
    {
      name: 'XD2',
      behavior: 'None',
      visual: {
        visualType: 'Icon',
        value: 'ArrowLeftRight',
        iconSource: ProcedureIconSource.Lucide,
      },
      targets: ['Tooth', 'Crown', 'Root', 'Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      category: 'Diagnostic',
      description: 'Diagnostic procedure XD2',
      isActive: true,
    },
    {
      name: 'Ubytek klinowy',
      behavior: 'None',
      visual: {
        visualType: 'Icon',
        value: 'TriangleRight',
        iconSource: ProcedureIconSource.Lucide,
      },
      targets: 'Tooth',
      category: 'Diagnostic',
      description: 'Wedge-shaped defect marking',
      isActive: true,
    },
    {
      name: 'Starcie',
      behavior: 'None',
      visual: { visualType: 'Icon', value: 'IconTilde', iconSource: ProcedureIconSource.Tabler },
      targets: ['Tooth', 'Crown', 'Root', 'Mesial', 'Distal', 'Buccal', 'Lingual', 'Incisal'],
      category: 'Diagnostic',
      description: 'Tooth wear/attrition marking',
      isActive: true,
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

  const handleProcedureSelect = (procedure: ProcedureWithTarget) => {
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

    selectedToothNumbers.value.forEach((number) => {
      const tooth = teeth.value.find((t) => t.number === number)
      if (!tooth) return
      if (isHideToothAssigned(tooth) && procedure.behavior !== 'HideTooth') return // Block if 'brak zęba' is present
      if (targets.length === 1) {
        // If only one possible target, assign to it
        const singleTarget = targets[0]
        if (
          !tooth.toothProcedures.some(
            (a) => a.toothPart.toLowerCase() === singleTarget && a.procedure.name === procedure.name,
          )
        ) {
          tooth.toothProcedures.push({
            procedure,
            toothPart: (singleTarget.charAt(0).toUpperCase() + singleTarget.slice(1)) as any,
          })
        }
      } else if (targets.includes('tooth')) {
        // If multiple targets, only assign if 'tooth' is a valid target
        if (
          !tooth.toothProcedures.some(
            (a) => a.toothPart.toLowerCase() === 'tooth' && a.procedure.name === procedure.name,
          )
        ) {
          tooth.toothProcedures.push({
            procedure,
            toothPart: 'Tooth',
          })
        }
      }
    })

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
    teeth.value = isPediatric
      ? getInitialPediatricTeeth()
      : getInitialPermanentTeeth()

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
    setSelectedProcedure: (procedure: ProcedureWithTarget | null) =>
      (selectedProcedure.value = procedure),
    setSearch: (value: string) => (search.value = value),
    setIsProcedureMissing: (value: boolean) => (isProcedureMissing.value = value),
  }
}
