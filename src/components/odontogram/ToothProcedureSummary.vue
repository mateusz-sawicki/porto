<!-- components/ToothProceduresSummary.vue -->
<template>
  <div class="w-full space-y-4">
    <div class="flex items-center justify-between mb-6">
      <h4 class="text-lg font-semibold">Assigned Procedures Summary</h4>
      <Badge variant="secondary" class="text-sm">
        {{ totalProcedures }} procedures on {{ teethWithProcedures.length }} teeth
      </Badge>
    </div>

    <div v-if="teethWithProcedures.length === 0" class="text-center py-8 text-muted-foreground">
      <div class="flex flex-col items-center gap-2">
        <div class="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <FileText class="w-6 h-6" />
        </div>
        <p class="text-sm">No procedures assigned yet</p>
        <p class="text-xs">Select procedures from the odontogram to see them here</p>
      </div>
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="toothData in sortedTeethWithProcedures"
        :key="toothData.toothNumber"
        class="border rounded-lg overflow-hidden"
      >
        <!-- Accordion Header -->
        <button
          @click="toggleAccordion(toothData.toothNumber)"
          class="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-muted/50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2">
              <div
                class="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-sm font-semibold"
              >
                {{ toothData.toothNumber }}
              </div>
            </div>
            <Badge variant="outline" class="text-xs">
              {{ toothData.procedures.length }}
              {{ toothData.procedures.length === 1 ? 'procedure' : 'procedures' }}
            </Badge>
          </div>
          <ChevronRight
            :class="[
              'w-5 h-5 transition-transform duration-200',
              accordionOpen[toothData.toothNumber] ? 'rotate-90' : '',
            ]"
          />
        </button>

        <!-- Accordion Content -->
        <div v-if="accordionOpen[toothData.toothNumber]" class="border-t bg-muted/25">
          <div class="p-4 space-y-3">
            <div
              v-for="(procedure, index) in toothData.procedures"
              :key="`${toothData.toothNumber}-${procedure.name}-${index}`"
              class="flex items-center justify-between p-3 bg-background rounded-md border"
            >
              <div class="flex items-center gap-3">
                <div
                  v-if="procedure.visual.visualType === 'Color'"
                  class="w-4 h-4 rounded-sm flex-shrink-0"
                  :style="{ backgroundColor: procedure.visual.value }"
                />
                <div
                  v-else-if="procedure.visual.visualType === 'Icon'"
                  class="w-4 h-4 flex items-center justify-center text-xs font-bold flex-shrink-0"
                >
                  {{ procedure.visual.value }}
                </div>
                <div
                  v-else-if="procedure.visual.visualType === 'GumShape'"
                  class="w-4 h-4 rounded-full border flex-shrink-0"
                  :style="{ borderColor: procedure.visual.value }"
                />
                <div
                  v-else-if="procedure.visual.visualType === 'ToothShape'"
                  class="w-4 h-4 rounded-sm border flex-shrink-0"
                  :style="{ borderColor: procedure.visual.value }"
                />
                <div
                  v-else-if="procedure.visual.visualType === 'Pattern'"
                  class="w-4 h-4 rounded-sm bg-gray-200 flex-shrink-0"
                />
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-sm">{{ procedure.name }}</p>
                  <p v-if="procedure.description" class="text-xs text-muted-foreground">
                    {{ procedure.description }}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                @click="() => removeProcedure(toothData.toothNumber, procedure)"
                class="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <X class="w-4 h-4" />
              </Button>
            </div>

            <!-- Tooth Summary -->
            <div
              class="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground"
            >
              <span>Total procedures: {{ toothData.procedures.length }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Footer -->
    <div v-if="teethWithProcedures.length > 0" class="border-t pt-4 mt-6">
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
        <div class="space-y-1">
          <div class="text-2xl font-bold text-primary">{{ teethWithProcedures.length }}</div>
          <div class="text-xs text-muted-foreground">Teeth with procedures</div>
        </div>
        <div class="space-y-1">
          <div class="text-2xl font-bold text-primary">{{ totalProcedures }}</div>
          <div class="text-xs text-muted-foreground">Total procedures</div>
        </div>
        <div class="space-y-1">
          <div class="text-2xl font-bold text-primary">{{ uniqueProcedureTypes }}</div>
          <div class="text-xs text-muted-foreground">Procedure types</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronRight, X, FileText } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

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
  teethWithProcedures: ToothWithProcedures[]
}

interface Emits {
  (e: 'remove-procedure', toothNumber: string, procedure: Procedure): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// State
const accordionOpen = ref<Record<string, boolean>>({})

// Computed
// Replace the existing sortedTeethWithProcedures computed property with this:
const sortedTeethWithProcedures = computed(() => {
  return [...props.teethWithProcedures].sort((a, b) => {
    const getSortOrder = (toothNumber: string): number => {
      const num = parseInt(toothNumber)

      // Handle invalid numbers
      if (isNaN(num)) return 999

      const quadrant = Math.floor(num / 10)
      const position = num % 10

      switch (quadrant) {
        case 1: // Upper right: 18 -> 11 (reverse order)
          return 8 - position + 0 // 0-7
        case 2: // Upper left: 21 -> 28 (normal order)
          return position - 1 + 8 // 8-15
        case 3: // Lower left: 38 -> 31 (reverse order)
          return 8 - position + 16 // 16-23
        case 4: // Lower right: 41 -> 48 (normal order)
          return position - 1 + 24 // 24-31
        default:
          return 999 // Invalid quadrant
      }
    }

    return getSortOrder(a.toothNumber) - getSortOrder(b.toothNumber)
  })
})

const totalProcedures = computed(() => {
  return props.teethWithProcedures.reduce((total, tooth) => total + tooth.procedures.length, 0)
})

const uniqueProcedureTypes = computed(() => {
  const procedureNames = new Set<string>()
  props.teethWithProcedures.forEach((tooth) => {
    tooth.procedures.forEach((procedure) => {
      procedureNames.add(procedure.name)
    })
  })
  return procedureNames.size
})

// Methods
const toggleAccordion = (toothNumber: string) => {
  accordionOpen.value[toothNumber] = !accordionOpen.value[toothNumber]
}

const removeProcedure = (toothNumber: string, procedure: Procedure) => {
  emit('remove-procedure', toothNumber, procedure)
}
</script>
