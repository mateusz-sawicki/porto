<template>
  <div class="space-y-6">
    <h3 class="text-lg font-semibold">Medical History</h3>

    <!-- Fixed columns layout -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
      <!-- Column 1 -->
      <div class="space-y-4">
        <div
          v-for="field in column1Fields"
          :key="field.id"
          class="bg-white border border-gray-200 rounded-lg p-4"
        >
          <div class="flex items-start space-x-2">
            <Checkbox :id="field.id" v-model="field.checked" class="mt-0.5 flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <Label
                :for="field.id"
                class="text-sm font-medium leading-tight cursor-pointer select-none"
              >
                {{ field.label }}
              </Label>
              <!-- Textarea expands within this column only -->
              <div v-if="field.hasTextarea && field.checked" class="mt-2">
                <Textarea
                  v-model="field.notes"
                  :placeholder="`Podaj szczegóły dotyczące: ${field.label.toLowerCase()}`"
                  class="w-full text-sm"
                  rows="2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Column 2 -->
      <div class="space-y-4">
        <div
          v-for="field in column2Fields"
          :key="field.id"
          class="bg-white border border-gray-200 rounded-lg p-4"
        >
          <div class="flex items-start space-x-2">
            <Checkbox :id="field.id" v-model="field.checked" class="mt-0.5 flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <Label
                :for="field.id"
                class="text-sm font-medium leading-tight cursor-pointer select-none"
              >
                {{ field.label }}
              </Label>
              <!-- Textarea expands within this column only -->
              <div v-if="field.hasTextarea && field.checked" class="mt-2">
                <Textarea
                  v-model="field.notes"
                  :placeholder="`Podaj szczegóły dotyczące: ${field.label.toLowerCase()}`"
                  class="w-full text-sm"
                  rows="2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Column 3 (desktop only) -->
      <div class="hidden xl:block space-y-4">
        <div
          v-for="field in column3Fields"
          :key="field.id"
          class="bg-white border border-gray-200 rounded-lg p-4"
        >
          <div class="flex items-start space-x-2">
            <Checkbox :id="field.id" v-model="field.checked" class="mt-0.5 flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <Label
                :for="field.id"
                class="text-sm font-medium leading-tight cursor-pointer select-none"
              >
                {{ field.label }}
              </Label>
              <!-- Textarea expands within this column only -->
              <div v-if="field.hasTextarea && field.checked" class="mt-2">
                <Textarea
                  v-model="field.notes"
                  :placeholder="`Podaj szczegóły dotyczące: ${field.label.toLowerCase()}`"
                  class="w-full text-sm"
                  rows="2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface MedicalField {
  id: string
  label: string
  checked: boolean
  hasTextarea: boolean
  notes: string
}

interface MedicalHistoryData {
  [key: string]: {
    checked: boolean
    notes?: string
  }
}

interface Props {
  modelValue?: MedicalHistoryData
}

interface Emits {
  (e: 'update:modelValue', data: MedicalHistoryData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const medicalFields = ref<MedicalField[]>([
  {
    id: 'heartDisease',
    label: 'Choroby serca?',
    checked: false,
    hasTextarea: true,
    notes: '',
  },
  {
    id: 'cardiovascularDisease',
    label: 'Choroby sercowo naczyniowe?',
    checked: false,
    hasTextarea: true,
    notes: '',
  },
  {
    id: 'hypertension',
    label: 'Nadciśnienie krwi?',
    checked: true,
    hasTextarea: true,
    notes: 'Nadciśnienie tętnicze, przyjmuję Amlodipine 5mg',
  },
  {
    id: 'bleedingDisorders',
    label: 'Krwawienie, zaburzenia krzepnięcia krwi?',
    checked: false,
    hasTextarea: true,
    notes: '',
  },
  {
    id: 'cancerDisease',
    label: 'Choroby nowotworowe?',
    checked: false,
    hasTextarea: true,
    notes: '',
  },
  {
    id: 'eatingDisorders',
    label: 'Zaburzenia odżywiania?',
    checked: false,
    hasTextarea: true,
    notes: '',
  },
  {
    id: 'immuneDisorders',
    label: 'Choroby układu odpornościowego?',
    checked: false,
    hasTextarea: true,
    notes: '',
  },
  {
    id: 'hepatitisBC',
    label: 'WZW typ B/C?',
    checked: false,
    hasTextarea: true,
    notes: '',
  },
  {
    id: 'hiv',
    label: 'HIV?',
    checked: false,
    hasTextarea: true,
    notes: '',
  },
  {
    id: 'neurologicalDisease',
    label: 'Choroby neurologiczne?',
    checked: false,
    hasTextarea: true,
    notes: '',
  },
  {
    id: 'epilepsy',
    label: 'Padaczka?',
    checked: false,
    hasTextarea: true,
    notes: '',
  },
  {
    id: 'hormonalDisorders',
    label: 'Zaburzenia hormonalne?',
    checked: false,
    hasTextarea: true,
    notes: '',
  },
  {
    id: 'diabetes',
    label: 'Cukrzyca?',
    checked: false,
    hasTextarea: true,
    notes: '',
  },
  {
    id: 'birthDefects',
    label: 'Wady wrodzone?',
    checked: false,
    hasTextarea: true,
    notes: '',
  },
  {
    id: 'hereditaryDisease',
    label: 'Choroby dziedziczne?',
    checked: false,
    hasTextarea: true,
    notes: '',
  },
  {
    id: 'rheumaticDisease',
    label: 'Choroby reumatoidalne?',
    checked: false,
    hasTextarea: true,
    notes: '',
  },
  {
    id: 'boneDisease',
    label: 'Choroby układu kostnego?',
    checked: false,
    hasTextarea: true,
    notes: '',
  },
  {
    id: 'kidneyDisease',
    label: 'Choroby nerek?',
    checked: false,
    hasTextarea: true,
    notes: '',
  },
  {
    id: 'liverDisease',
    label: 'Choroby wątroby?',
    checked: false,
    hasTextarea: true,
    notes: '',
  },
  {
    id: 'mentalDisease',
    label: 'Choroby psychiczne?',
    checked: false,
    hasTextarea: true,
    notes: '',
  },
  {
    id: 'depression',
    label: 'Depresja?',
    checked: true,
    hasTextarea: true,
    notes: 'Epizody depresyjne w latach 2018-2019, obecnie w remisji',
  },
  {
    id: 'psychiatricConsultation',
    label: 'Czy w czasie ostatnich 3 lat była konsultacja psychiatryczna?',
    checked: true,
    hasTextarea: true,
    notes: 'Konsultacja w 2021 roku z powodu depresji, zalecona psychoterapia',
  },
  {
    id: 'asthma',
    label: 'Astma?',
    checked: false,
    hasTextarea: true,
    notes: '',
  },
  {
    id: 'allergies',
    label: 'Alergie?',
    checked: true,
    hasTextarea: true,
    notes: 'Alergia na penicylinę i kurz domowy',
  },
  {
    id: 'adhd',
    label: 'ADHD?',
    checked: false,
    hasTextarea: true,
    notes: '',
  },
  {
    id: 'anxiety',
    label: 'Lękliwość?',
    checked: true,
    hasTextarea: true,
    notes: 'Zaburzenia lękowe uogólnione, leczone farmakologicznie',
  },
  {
    id: 'aspergerSyndrome',
    label: 'Zespół Aspergera?',
    checked: false,
    hasTextarea: true,
    notes: '',
  },
  {
    id: 'coordinationDisorders',
    label: 'Zaburzenia koordynacji? Jakie?',
    checked: false,
    hasTextarea: true,
    notes: '',
  },
])

// Split fields into columns evenly
const fieldsPerColumn = computed(() => Math.ceil(medicalFields.value.length / 3))

const column1Fields = computed(() => medicalFields.value.slice(0, fieldsPerColumn.value))

const column2Fields = computed(() =>
  medicalFields.value.slice(fieldsPerColumn.value, fieldsPerColumn.value * 2),
)

const column3Fields = computed(() => medicalFields.value.slice(fieldsPerColumn.value * 2))

const emitData = () => {
  const data: MedicalHistoryData = {}
  medicalFields.value.forEach((field) => {
    data[field.id] = {
      checked: field.checked,
      ...(field.hasTextarea && field.checked && { notes: field.notes }),
    }
  })
  emit('update:modelValue', data)
}

// Watch for changes in the reactive medicalFields
watch(
  medicalFields,
  () => {
    // Clear notes when unchecked
    medicalFields.value.forEach((field) => {
      if (!field.checked) {
        field.notes = ''
      }
    })
    emitData()
  },
  { deep: true },
)

// Initialize with props data
if (props.modelValue) {
  Object.entries(props.modelValue).forEach(([key, value]) => {
    const field = medicalFields.value.find((f) => f.id === key)
    if (field) {
      field.checked = value.checked
      field.notes = value.notes || ''
    }
  })
}
</script>
