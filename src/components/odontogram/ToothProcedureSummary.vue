<!-- components/ToothProceduresSummary.vue -->
<template>
  <div class="w-full space-y-4">
    <div class="flex items-center justify-between mb-6">
      <h4 class="text-lg font-semibold">Assigned Procedures Summary</h4>
      <Badge variant="secondary" class="text-sm">
        {{ totalProcedures }} procedures on {{ sortedTeethWithProcedures.length }} teeth
      </Badge>
    </div>

    <div
      v-if="sortedTeethWithProcedures.length === 0"
      class="text-center py-8 text-muted-foreground"
    >
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
              {{ toothData.groupedProcedures.length }}
              {{ toothData.groupedProcedures.length === 1 ? 'group' : 'groups' }}
            </Badge>
            <Badge variant="secondary" class="text-xs">
              {{ toothData.totalProcedureCount }}
              {{ toothData.totalProcedureCount === 1 ? 'procedure' : 'procedures' }}
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
              v-for="(groupedProcedure, index) in toothData.groupedProcedures"
              :key="`${toothData.toothNumber}-${groupedProcedure.name}-${index}`"
              class="bg-background rounded-md border"
            >
              <!-- Main procedure row -->
              <div class="flex items-center justify-between p-3">
                <div class="flex items-center gap-3">
                  <div
                    v-if="
                      groupedProcedure.visual.visualType === 'Color' &&
                      groupedProcedure.visual.value
                    "
                    class="w-4 h-4 rounded-sm flex-shrink-0"
                    :style="{ backgroundColor: groupedProcedure.visual.value }"
                  />
                  <div
                    v-else-if="
                      groupedProcedure.visual.visualType === 'Icon' && groupedProcedure.visual.value
                    "
                    class="w-4 h-4 flex items-center justify-center text-xs font-bold flex-shrink-0"
                  >
                    {{ groupedProcedure.visual.value }}
                  </div>
                  <div
                    v-else-if="
                      groupedProcedure.visual.visualType === 'GumShape' &&
                      groupedProcedure.visual.value
                    "
                    class="w-4 h-4 rounded-full border flex-shrink-0"
                    :style="{ borderColor: groupedProcedure.visual.value }"
                  />
                  <!-- Do not render anything for ToothShape -->
                  <div
                    v-else-if="
                      groupedProcedure.visual.visualType === 'Pattern' &&
                      groupedProcedure.visual.value
                    "
                    class="w-4 h-4 rounded-sm bg-gray-200 flex-shrink-0"
                  />
                  <div class="flex-1 min-w-0">
                    <!-- Procedure name and location chips on same line -->
                    <div class="flex items-center flex-wrap gap-2">
                      <p class="font-semibold text-base">{{ groupedProcedure.name }}</p>
                      <!-- Show locations where this procedure is applied -->
                      <div
                        v-for="(location, locationIndex) in groupedProcedure.locations"
                        :key="`${location}-${locationIndex}`"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm group hover:bg-secondary/80"
                      >
                        <span>{{ location }}</span>
                        <button
                          @click="
                            () =>
                              removeSpecificProcedure(
                                toothData.toothNumber,
                                groupedProcedure,
                                locationIndex,
                              )
                          "
                          class="w-4 h-4 rounded-full bg-secondary-foreground/20 hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center transition-colors"
                          :title="`Remove ${groupedProcedure.name} from ${location}`"
                        >
                          <X class="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                    <!-- Show count info -->
                    <p v-if="groupedProcedure.originalProcedures.length > 1" class="text-xs text-muted-foreground mt-1">
                      {{ groupedProcedure.originalProcedures.length }} locations total
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  @click="() => removeGroupedProcedure(toothData.toothNumber, groupedProcedure)"
                  class="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground text-muted-foreground hover:text-white"
                  :title="`Remove all ${groupedProcedure.name} procedures from this tooth (${groupedProcedure.originalProcedures.length} locations)`"
                >
                  <X class="w-4 h-4" />
                </Button>
              </div>
            </div>

            <!-- Tooth Summary -->
            <div
              class="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground"
            >
              <span
                >{{ toothData.groupedProcedures.length }} procedure groups ({{
                  toothData.totalProcedureCount
                }}
                total)</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Footer -->
    <div v-if="sortedTeethWithProcedures.length > 0" class="border-t pt-4 mt-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div class="space-y-1">
          <div class="text-2xl font-bold text-primary">{{ sortedTeethWithProcedures.length }}</div>
          <div class="text-xs text-muted-foreground">Teeth with procedures</div>
        </div>
        <div class="space-y-1">
          <div class="text-2xl font-bold text-primary">{{ totalProcedures }}</div>
          <div class="text-xs text-muted-foreground">Total procedures</div>
        </div>
        <div class="space-y-1">
          <div class="text-2xl font-bold text-primary">
            {{
              sortedTeethWithProcedures.reduce(
                (total, tooth) => total + tooth.groupedProcedures.length,
                0,
              )
            }}
          </div>
          <div class="text-xs text-muted-foreground">Procedure groups</div>
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

interface GroupedProcedure {
  name: string
  description?: string
  visual: {
    visualType: 'Color' | 'Pattern' | 'Icon' | 'GumShape' | 'ToothShape'
    value: string
  }
  locations: string[]
  originalProcedures: Procedure[]
}

interface ToothWithProcedures {
  toothNumber: string
  procedures: Procedure[]
}

interface ToothWithGroupedProcedures {
  toothNumber: string
  groupedProcedures: GroupedProcedure[]
  totalProcedureCount: number
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
// Create grouped procedures for each tooth
const teethWithGroupedProcedures = computed(() => {
  return props.teethWithProcedures.map((tooth) => {
    const procedureGroups = new Map<string, GroupedProcedure>()

    tooth.procedures.forEach((procedure) => {
      const key = procedure.name

      if (procedureGroups.has(key)) {
        // Add location to existing group
        const existing = procedureGroups.get(key)!
        existing.locations.push(procedure.description || '')
        existing.originalProcedures.push(procedure)
      } else {
        // Create new group
        procedureGroups.set(key, {
          name: procedure.name,
          description: procedure.description,
          visual: procedure.visual,
          locations: [procedure.description || ''],
          originalProcedures: [procedure],
        })
      }
    })

    return {
      toothNumber: tooth.toothNumber,
      groupedProcedures: Array.from(procedureGroups.values()),
      totalProcedureCount: tooth.procedures.length,
    } as ToothWithGroupedProcedures
  })
})

const sortedTeethWithProcedures = computed(() => {
  return [...teethWithGroupedProcedures.value].sort((a, b) => {
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
  return sortedTeethWithProcedures.value.reduce(
    (total, tooth) => total + tooth.totalProcedureCount,
    0,
  )
})

const uniqueProcedureTypes = computed(() => {
  const procedureNames = new Set<string>()
  sortedTeethWithProcedures.value.forEach((tooth) => {
    tooth.groupedProcedures.forEach((groupedProcedure) => {
      procedureNames.add(groupedProcedure.name)
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

const removeGroupedProcedure = (toothNumber: string, groupedProcedure: GroupedProcedure) => {
  // Remove all procedures in this group
  groupedProcedure.originalProcedures.forEach((procedure) => {
    emit('remove-procedure', toothNumber, procedure)
  })
}

const removeSpecificProcedure = (
  toothNumber: string,
  groupedProcedure: GroupedProcedure,
  locationIndex: number,
) => {
  // Remove only the specific procedure at the given location index
  const procedureToRemove = groupedProcedure.originalProcedures[locationIndex]
  if (procedureToRemove) {
    emit('remove-procedure', toothNumber, procedureToRemove)
  }
}
</script>
