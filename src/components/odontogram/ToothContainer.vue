<!-- components/ToothContainer.vue - Schematic Moved to End with Margin -->
<template>
  <Popover :open="showTooltip">
    <PopoverTrigger asChild>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            class="tooth-wrapper"
            :class="{
              selected: isSelected,
              'empty-slot': tooth.isEmptySlot,
            }"
            @click="handleToothClick"
            @mouseenter="hoveredTooth = tooth.number"
            @mouseleave="hoveredTooth = null"
          >
            <!-- Empty Slot Content -->
            <div
              v-if="tooth.isEmptySlot"
              class="tooth-group"
              :class="{ 'tooth-group--bottom': direction === ToothContainerDirection.Bottom }"
            >
              <ToothLabel
                :toothNumber="tooth.number"
                :isExtra="false"
                :direction="direction"
                :disabled="true"
                :isEmpty="true"
                @add-extra-before="
                  $emit('add-extra-tooth', {
                    base: tooth.number,
                    direction: ExtraToothDirection.Before,
                  })
                "
                @add-extra-after="
                  $emit('add-extra-tooth', {
                    base: tooth.number,
                    direction: ExtraToothDirection.After,
                  })
                "
                @remove-tooth="$emit('remove-tooth', tooth.number)"
              />
              <div class="tooth-components-wrapper">
                <GumOverlay :direction="direction" />
              </div>
            </div>

            <!-- Regular Tooth Content -->
            <div
              v-else
              class="tooth-group"
              :class="{ 'tooth-group--bottom': direction === ToothContainerDirection.Bottom }"
            >
              <template v-if="direction === ToothContainerDirection.Top">
                <ToothLabel
                  :toothNumber="tooth.number"
                  :isExtra="isExtra"
                  :direction="direction"
                  @add-extra-before="
                    $emit('add-extra-tooth', {
                      base: tooth.number,
                      direction: ExtraToothDirection.Before,
                    })
                  "
                  @add-extra-after="
                    $emit('add-extra-tooth', {
                      base: tooth.number,
                      direction: ExtraToothDirection.After,
                    })
                  "
                  @remove-tooth="$emit('remove-tooth', tooth.number)"
                />

                <!-- Single wrapper for tooth components (Schematic moved out) -->
                <div
                  class="tooth-components-wrapper"
                  :class="{ 'extraction-blocked': !!extraction }"
                >
                  <GumOverlay :direction="direction" :hasCutout="hasExposedToothProcedure" />
                  <template v-if="!hideTooth">
                    <template v-if="rootOnly">
                      <!-- 🎯 Clipping container specifically for tooth -->
                      <div class="tooth-clip-container">
                        <div
                          class="tooth-only-wrapper"
                          :class="{ 'impacted-tooth--top': isImpactedTooth }"
                        >
                          <Tooth
                            :number="tooth.number"
                            :toothProcedures="tooth.toothProcedures"
                            :selectedSegments="extraction ? [] : selectedSegments"
                            :direction="direction"
                            only-root
                            :isPediatric="props.isPediatric"
                            @segment-click="handleSegmentClick"
                          />
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <!-- 🎯 Clipping container specifically for tooth -->
                      <div class="tooth-clip-container">
                        <div
                          class="tooth-only-wrapper"
                          :class="{ 'impacted-tooth--top': isImpactedTooth }"
                        >
                          <Tooth
                            :number="tooth.number"
                            :toothProcedures="tooth.toothProcedures"
                            :selectedSegments="extraction ? [] : selectedSegments"
                            :direction="direction"
                            :isPediatric="props.isPediatric"
                            @segment-click="handleSegmentClick"
                          />
                        </div>
                      </div>
                    </template>
                  </template>
                  <!-- Single hover blocker for all components -->
                  <div v-if="extraction" class="hover-blocker"></div>
                </div>

                <!-- 🎯 Schematic moved to end with margin -->
                <template v-if="!hideTooth && !rootOnly">
                  <div class="schematic-at-end">
                    <Schematic
                      :number="tooth.number"
                      :schemaProcedures="tooth.schemaProcedures"
                      :selectedSegments="extraction ? [] : selectedSegments"
                      :direction="direction"
                      @segment-click="handleSegmentClick"
                    />
                  </div>
                </template>
              </template>
              <template v-else>
                <!-- 🎯 Schematic moved to end with margin for bottom direction -->
                <template v-if="!hideTooth && !rootOnly">
                  <div class="schematic-at-end schematic-at-end--bottom">
                    <Schematic
                      :number="tooth.number"
                      :schemaProcedures="tooth.schemaProcedures"
                      :selectedSegments="extraction ? [] : selectedSegments"
                      :direction="direction"
                      @segment-click="handleSegmentClick"
                    />
                  </div>
                </template>

                <!-- Single wrapper for tooth components (Schematic moved out) -->
                <div
                  class="tooth-components-wrapper"
                  :class="{ 'extraction-blocked': !!extraction }"
                >
                  <GumOverlay :direction="direction" :hasCutout="hasExposedToothProcedure" />
                  <template v-if="!hideTooth">
                    <template v-if="rootOnly">
                      <!-- 🎯 Clipping container specifically for tooth -->
                      <div class="tooth-clip-container">
                        <div
                          class="tooth-only-wrapper"
                          :class="{ 'impacted-tooth--bottom': isImpactedTooth }"
                        >
                          <Tooth
                            :number="tooth.number"
                            :toothProcedures="tooth.toothProcedures"
                            :selectedSegments="extraction ? [] : selectedSegments"
                            :direction="direction"
                            only-root
                            :isPediatric="props.isPediatric"
                            @segment-click="handleSegmentClick"
                          />
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <!-- 🎯 Clipping container specifically for tooth -->
                      <div class="tooth-clip-container">
                        <div
                          class="tooth-only-wrapper"
                          :class="{ 'impacted-tooth--bottom': isImpactedTooth }"
                        >
                          <Tooth
                            :number="tooth.number"
                            :toothProcedures="tooth.toothProcedures"
                            :selectedSegments="extraction ? [] : selectedSegments"
                            :direction="direction"
                            :isPediatric="props.isPediatric"
                            @segment-click="handleSegmentClick"
                          />
                        </div>
                      </div>
                    </template>
                  </template>
                  <!-- Single hover blocker for all components -->
                  <div v-if="extraction" class="hover-blocker"></div>
                </div>

                <ToothLabel
                  :toothNumber="tooth.number"
                  :isExtra="isExtra"
                  :isSelected="isSelected"
                  @add-extra-before="
                    $emit('add-extra-tooth', {
                      base: tooth.number,
                      direction: ExtraToothDirection.Before,
                    })
                  "
                  @add-extra-after="
                    $emit('add-extra-tooth', {
                      base: tooth.number,
                      direction: ExtraToothDirection.After,
                    })
                  "
                  @remove-tooth="$emit('remove-tooth', tooth.number)"
                  :direction="direction"
                />
              </template>
            </div>
            <div
              v-if="extraction || isToothMissing"
              class="full-hover-blocker"
              :class="direction === ToothContainerDirection.Top ? 'blocker-top' : 'blocker-bottom'"
            ></div>
            <ExtractionOverlay v-if="extraction" :direction="direction" />

            <!-- Observation Overlays for different parts -->
            <IconOverlay
              v-if="toothLevelIconProcedures.length > 0"
              :direction="direction"
              position="tooth"
            >
              <div
                class="flex flex-wrap items-center justify-center gap-1 max-w-full"
                v-for="(assignment, idx) in visibleToothLevelIconProcedures"
                :key="assignment.procedure.name + idx"
              >
                <div
                  v-if="assignment.procedure.visual.visualType === 'Color'"
                  class="w-4 h-4 rounded-sm flex-shrink-0"
                  :style="{ backgroundColor: assignment.procedure.visual.value }"
                />
                <ProcedureIcon
                  v-else-if="assignment.procedure.visual.visualType === 'Icon'"
                  :icon-name="assignment.procedure.visual.value!"
                  :icon-source="assignment.procedure.visual.iconSource"
                />
                <span
                  v-if="showPlusN"
                  class="w-5 h-5 flex items-center justify-center text-xs font-bold text-blue-600 opacity-80"
                  >+{{ hiddenIconCount }}</span
                >
              </div>
            </IconOverlay>

            <!-- Extraction and missing tooth overlays -->
            <div
              v-if="extraction || isToothMissing"
              class="full-hover-blocker"
              :class="direction === ToothContainerDirection.Top ? 'blocker-top' : 'blocker-bottom'"
            ></div>
            <ExtractionOverlay v-if="extraction" :direction="direction" />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <!-- Multi-selection actions -->
          <ContextMenuLabel v-if="hasMultipleSelection"
            >Selected Teeth ({{ selectedToothCount }})</ContextMenuLabel
          >

          <!-- Add/Remove Actions for Multi-Selection -->
          <ContextMenuGroup v-if="hasMultipleSelection">
            <ContextMenuItem
              v-if="hasSelectedEmptySlots"
              @click="handleAddSelectedTeeth"
              :disabled="!canAddSelectedTeeth"
            >
              <Plus class="mr-2 h-4 w-4" />
              Add Selected Teeth ({{ formatToothNumbers(selectedEmptyNumbers) }})
            </ContextMenuItem>
            <ContextMenuItem
              v-if="hasSelectedRealTeeth"
              @click="handleRemoveSelectedTeeth"
              :disabled="!canRemoveSelectedTeeth"
            >
              <Minus class="mr-2 h-4 w-4" />
              Remove Selected Teeth ({{ formatToothNumbers(selectedRealNumbers) }})
            </ContextMenuItem>
          </ContextMenuGroup>

          <!-- Conversion Actions for Multi-Selection -->
          <ContextMenuGroup v-if="hasMultipleSelection && hasSelectedRealTeeth">
            <ContextMenuSeparator />
            <ContextMenuItem
              v-if="multiSelectionAvailableConversions?.toPrimary.length"
              @click="handleConvertSelectedToPrimary"
              :disabled="!canConvertSelectedToPrimary"
            >
              <Baby class="mr-2 h-4 w-4" />
              Convert to Primary ({{ formatToothNumbers(selectedToPrimaryNumbers) }})
            </ContextMenuItem>
            <ContextMenuItem
              v-if="multiSelectionAvailableConversions?.toPermanent.length"
              @click="handleConvertSelectedToPermanent"
              :disabled="!canConvertSelectedToPermanent"
            >
              <User class="mr-2 h-4 w-4" />
              Convert to Permanent ({{ formatToothNumbers(selectedToPermanentNumbers) }})
            </ContextMenuItem>
            <ContextMenuSeparator />
            <!-- Root Only Action for Multi-Selection -->
            <ContextMenuItem
              @click="handleApplyRootOnlyToSelected"
              :disabled="!canApplyRootOnlyToSelected"
            >
              <TreePine class="mr-2 h-4 w-4" />
              Apply Root Only ({{ formatToothNumbers(selectedRealNumbers) }})
            </ContextMenuItem>
          </ContextMenuGroup>

          <!-- Single tooth actions -->
          <ContextMenuLabel v-if="!hasMultipleSelection"
            >{{ tooth.isEmptySlot ? 'Empty Slot' : 'Single Tooth' }} Actions</ContextMenuLabel
          >

          <!-- Single Tooth - Add/Remove -->
          <ContextMenuItem
            v-if="!hasMultipleSelection && tooth.isEmptySlot"
            @click="handleAddTooth"
            :disabled="!canAddTooth"
          >
            <Plus class="mr-2 h-4 w-4" />
            Add Tooth
          </ContextMenuItem>
          <ContextMenuItem
            v-if="!hasMultipleSelection && !tooth.isEmptySlot"
            @click="handleRemoveTooth"
            :disabled="!canRemoveTooth"
          >
            <Minus class="mr-2 h-4 w-4" />
            Remove Tooth
          </ContextMenuItem>

          <!-- Single Tooth - Root Only (only for real teeth) -->
          <ContextMenuItem
            v-if="!hasMultipleSelection && !tooth.isEmptySlot"
            @click="handleApplyRootOnly"
            :disabled="!canApplyRootOnly"
          >
            <TreePine class="mr-2 h-4 w-4" />
            Root Only
          </ContextMenuItem>

          <!-- Single tooth conversions (only for real teeth) -->
          <ContextMenuSeparator
            v-if="
              !hasMultipleSelection &&
              !tooth.isEmptySlot &&
              availableConversions &&
              (availableConversions.toPrimary || availableConversions.toPermanent)
            "
          />
          <ContextMenuItem
            v-if="!hasMultipleSelection && !tooth.isEmptySlot && availableConversions?.toPrimary"
            @click="handleConvertToPrimary"
            :disabled="!canConvertToPrimary"
          >
            <Baby class="mr-2 h-4 w-4" />
            Convert to Primary
          </ContextMenuItem>
          <ContextMenuItem
            v-if="!hasMultipleSelection && !tooth.isEmptySlot && availableConversions?.toPermanent"
            @click="handleConvertToPermanent"
            :disabled="!canConvertToPermanent"
          >
            <User class="mr-2 h-4 w-4" />
            Convert to Permanent
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </PopoverTrigger>
    <PopoverContent v-if="groupedProceduresForTooltip.length > 0" class="w-auto max-w-xs">
      <div class="space-y-2">
        <div class="font-semibold text-sm mb-2">Tooth {{ tooth.number }}</div>
        <div class="space-y-1">
          <div v-for="group in groupedProceduresForTooltip" :key="group.name" class="text-sm">
            <div class="flex items-center gap-2">
              <!-- Visual indicator -->
              <div
                v-if="group.visual.visualType === 'Color' && group.visual.value"
                class="w-3 h-3 rounded-sm flex-shrink-0"
                :style="{ backgroundColor: group.visual.value }"
              />
              <span class="font-medium">{{ group.name }}</span>
            </div>
            <div class="flex flex-wrap gap-1 mt-1 ml-5">
              <span
                v-for="(location, index) in group.locations"
                :key="index"
                class="inline-flex px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded text-xs"
              >
                {{ location }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import type { ToothData } from '@/types/odontogram/odontogram'
import { ToothContainerDirection, ExtraToothDirection } from '@/types/odontogram/odontogram'
import ExtractionOverlay from './ExtractionOverlay.vue'
import GumOverlay from './GumOverlay.vue'
import IconOverlay from './IconOverlay.vue'
import Tooth from './Tooth.vue'
import Schematic from './Schematic.vue'
import ToothLabel from './ToothLabel.vue'
import { Plus, Minus, User, Baby, TreePine } from 'lucide-vue-next'
import ProcedureIcon from './ProcedureIcon.vue'
import type { useOdontogram } from '@/composables/odontogram/useOdontogram'
import { getAvailableConversions } from '@/utils/toothConversion'

interface Props {
  tooth: ToothData
  isSelected: boolean
  selectedSegments: string[]
  direction: ToothContainerDirection
  isPediatric?: boolean
}

interface Emits {
  (e: 'tooth-click'): void
  (e: 'segment-click', segmentId: string): void
  (e: 'add-extra-tooth', event: { base: string; direction: ExtraToothDirection }): void
  (e: 'remove-tooth', number: string): void
}

interface GroupedProcedure {
  name: string
  description?: string
  visual: {
    visualType: 'Color' | 'Pattern' | 'Icon' | 'GumShape' | 'ToothShape'
    value: string
  }
  locations: string[]
  originalProcedures: any[]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Inject odontogram composable for tooth actions
const odontogram = inject<ReturnType<typeof useOdontogram>>('odontogram')

const hoveredTooth = ref<string | null>(null)

const isExtra = computed(() => props.tooth.number.includes('+') || props.tooth.number.includes('-'))

const assignedToothLevelProcedures = computed(() =>
  props.tooth.toothProcedures.filter((a) => a.toothPart.toLowerCase() === 'tooth'),
)

const extraction = computed(() =>
  assignedToothLevelProcedures.value.find(
    (a) =>
      a.procedure.name === 'Ekstrakcja' &&
      (a.procedure.visual.visualType === 'Icon' || a.procedure.visual.visualType === 'ToothShape'),
  ),
)

// Add computed for 'brak zęba' (tooth missing)
const isToothMissing = computed(() =>
  assignedToothLevelProcedures.value.some(
    (a) => a.procedure.name === 'Brak zęba' || a.procedure.behavior === 'HideTooth',
  ),
)

const hasExposedToothProcedure = computed(() =>
  assignedToothLevelProcedures.value.some(
    (p) => p.procedure.name === 'Recesja' && p.procedure.visual.visualType === 'GumShape',
  ),
)

const hideTooth = computed(() =>
  assignedToothLevelProcedures.value.some((a) => a.procedure.behavior === 'HideTooth'),
)

const rootOnly = computed(() =>
  assignedToothLevelProcedures.value.some((a) => a.procedure.behavior === 'RootOnly'),
)

// 🎯 Check if tooth has impacted tooth procedure
const isImpactedTooth = computed(() =>
  assignedToothLevelProcedures.value.some((a) => a.procedure.behavior === 'ImpactedTooth'),
)

// 🎯 Check for observation procedures at different levels
const toothLevelObservation = computed(() =>
  assignedToothLevelProcedures.value.find(
    (a) => a.procedure.name === 'Obserwacja' && a.toothPart === 'Tooth',
  ),
)

const crownObservation = computed(() =>
  props.tooth.toothProcedures.find(
    (a) => a.procedure.name === 'Obserwacja' && a.toothPart === 'Crown',
  ),
)

const rootObservation = computed(() =>
  props.tooth.toothProcedures.find(
    (a) => a.procedure.name === 'Obserwacja' && a.toothPart === 'Root',
  ),
)

const schematicObservation = computed(() =>
  props.tooth.schemaProcedures.find((a) => a.procedure.name === 'Obserwacja'),
)

// Create grouped procedures for tooltip (similar to ToothProcedureSummary)
const groupedProceduresForTooltip = computed(() => {
  const procedureGroups = new Map<string, GroupedProcedure>()
  const allProcedures: Array<{
    name: string
    description: string
    visual: { visualType: string, value: string }
  }> = []
  
  // Add tooth procedures (Tooth, Crown, Root)
  props.tooth.toothProcedures.forEach((assignment) => {
    allProcedures.push({
      name: assignment.procedure.name,
      description: `${assignment.toothPart}${assignment.position ? ` (${assignment.position})` : ''}`,
      visual: {
        visualType: assignment.procedure.visual.visualType,
        value: assignment.procedure.visual.value!,
      },
    })
  })

  // Add schema procedures (Mesial, Distal, Buccal, Lingual)
  props.tooth.schemaProcedures.forEach((assignment) => {
    allProcedures.push({
      name: assignment.procedure.name,
      description: `${assignment.surface} surface`,
      visual: {
        visualType: assignment.procedure.visual.visualType,
        value: assignment.procedure.visual.value!,
      },
    })
  })

  // Group procedures by name
  allProcedures.forEach((procedure) => {
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
        visual: procedure.visual as {
          visualType: 'Color' | 'Pattern' | 'Icon' | 'GumShape' | 'ToothShape'
          value: string
        },
        locations: [procedure.description || ''],
        originalProcedures: [procedure],
      })
    }
  })

  return Array.from(procedureGroups.values())
})

const showTooltip = computed(
  () => hoveredTooth.value === props.tooth.number && groupedProceduresForTooltip.value.length > 0,
)

const handleToothClick = () => {
  // Prevent tooth selection when extracted or hidden, but still allow the click event to bubble
  // This way ToothLabel interactions still work
  if (!extraction.value && !hideTooth.value) {
    emit('tooth-click')
  }
}

const handleSegmentClick = (segmentId: string) => {
  // Prevent segment clicks when extracted
  if (!extraction.value) {
    emit('segment-click', segmentId)
  }
}

// 🎯 Get all tooth-level icon procedures, deduplicated by name and icon
const toothLevelIconProcedures = computed(() => {
  const seen = new Set()
  return assignedToothLevelProcedures.value.filter((a) => {
    const key = a.procedure.name + '|' + a.procedure.visual.value
    if (a.procedure.visual.visualType === 'Icon' && !seen.has(key)) {
      seen.add(key)
      return true
    }
    return false
  })
})

const MAX_ICONS_PER_LINE = 3
const MAX_VISIBLE_ICONS = 2 * MAX_ICONS_PER_LINE // 6

const showPlusN = computed(() => toothLevelIconProcedures.value.length > MAX_VISIBLE_ICONS)
const visibleToothLevelIconProcedures = computed(() => {
  if (showPlusN.value) {
    // Show first 5, then +N
    return toothLevelIconProcedures.value.slice(0, MAX_VISIBLE_ICONS - 1)
  }
  return toothLevelIconProcedures.value.slice(0, MAX_VISIBLE_ICONS)
})
const hiddenIconCount = computed(() =>
  showPlusN.value ? toothLevelIconProcedures.value.length - (MAX_VISIBLE_ICONS - 1) : 0,
)

// Context menu computed properties
const availableConversions = computed(() => {
  if (!props.tooth || props.tooth.isEmptySlot) return null
  return getAvailableConversions([props.tooth.number])
})

const canAddTooth = computed(() => {
  return props.tooth.isEmptySlot && odontogram?.addToothToEmptySlot
})

const canRemoveTooth = computed(() => {
  return (
    !props.tooth.isEmptySlot &&
    !extraction.value &&
    !hideTooth.value &&
    odontogram?.removeToothToEmptySlot
  )
})

const canConvertToPrimary = computed(() => {
  return (
    !props.tooth.isEmptySlot &&
    availableConversions.value?.toPrimary &&
    odontogram?.convertSelectedTeethToPrimary
  )
})

const canConvertToPermanent = computed(() => {
  return (
    !props.tooth.isEmptySlot &&
    availableConversions.value?.toPermanent &&
    odontogram?.convertSelectedTeethToPermanent
  )
})

// Multi-selection computed properties
const hasMultipleSelection = computed(() => {
  return (odontogram?.selectedToothNumbers.value.length || 0) > 1
})

const selectedToothCount = computed(() => {
  return odontogram?.selectedToothNumbers.value.length || 0
})

const hasSelectedEmptySlots = computed(() => {
  return odontogram?.hasSelectedEmptySlots.value || false
})

const hasSelectedRealTeeth = computed(() => {
  return odontogram?.hasSelectedRealTeeth.value || false
})

const selectedEmptyCount = computed(() => {
  return (
    odontogram?.selectedToothNumbers.value.filter((toothNumber) => {
      const tooth = odontogram?.teeth.value.find((t) => t.number === toothNumber)
      return tooth?.isEmptySlot === true
    }).length || 0
  )
})

const selectedRealCount = computed(() => {
  return (
    odontogram?.selectedToothNumbers.value.filter((toothNumber) => {
      const tooth = odontogram?.teeth.value.find((t) => t.number === toothNumber)
      return tooth?.isEmptySlot !== true
    }).length || 0
  )
})

// Get actual tooth numbers for display
const selectedEmptyNumbers = computed(() => {
  return (
    odontogram?.selectedToothNumbers.value.filter((toothNumber) => {
      const tooth = odontogram?.teeth.value.find((t) => t.number === toothNumber)
      return tooth?.isEmptySlot === true
    }) || []
  )
})

const selectedRealNumbers = computed(() => {
  const firstDigit = (num: string) => num[0]
  const lastDigit = (num: string) => num[1]
  
  return (
    odontogram?.selectedToothNumbers.value.filter((toothNumber) => {
      const tooth = odontogram?.teeth.value.find((t) => t.number === toothNumber)
      if (!tooth || tooth.isEmptySlot) return false
      
      // Same logic as removeToothToEmptySlot - only removable teeth
      const isBabyTooth = ['5', '6', '7', '8'].includes(firstDigit(toothNumber)) && ['1', '2', '3', '4', '5'].includes(lastDigit(toothNumber))
      const isPermanentTooth = ['1', '2', '3', '4'].includes(firstDigit(toothNumber)) && ['1', '2', '3', '4', '5', '6', '7', '8'].includes(lastDigit(toothNumber))
      return isBabyTooth || isPermanentTooth
    }) || []
  )
})

const multiSelectionAvailableConversions = computed(() => {
  if (!odontogram?.selectedToothNumbers.value.length) return null
  return odontogram.availableConversions.value
})

// Get conversion tooth numbers for display
const selectedToPrimaryNumbers = computed(() => {
  return multiSelectionAvailableConversions.value?.toPrimary || []
})

const selectedToPermanentNumbers = computed(() => {
  return multiSelectionAvailableConversions.value?.toPermanent || []
})

// Helper function to format tooth numbers for display - show ALL teeth
const formatToothNumbers = (numbers: string[]): string => {
  if (numbers.length === 0) return ''
  return numbers.join(', ')
}

const canAddSelectedTeeth = computed(() => {
  return hasSelectedEmptySlots.value && odontogram?.addTeethToSelectedEmptySlots
})

const canRemoveSelectedTeeth = computed(() => {
  return hasSelectedRealTeeth.value && odontogram?.removeSelectedTeeth
})

const canConvertSelectedToPrimary = computed(() => {
  return (
    (multiSelectionAvailableConversions.value?.toPrimary.length || 0) > 0 &&
    odontogram?.convertSelectedTeethToPrimary
  )
})

const canConvertSelectedToPermanent = computed(() => {
  return (
    (multiSelectionAvailableConversions.value?.toPermanent.length || 0) > 0 &&
    odontogram?.convertSelectedTeethToPermanent
  )
})

const canApplyRootOnly = computed(() => {
  return !props.tooth.isEmptySlot && !extraction.value && !hideTooth.value && !rootOnly.value
})

const canApplyRootOnlyToSelected = computed(() => {
  return (
    hasSelectedRealTeeth.value &&
    odontogram?.selectedToothNumbers.value.some((toothNumber) => {
      const tooth = odontogram?.teeth.value.find((t) => t.number === toothNumber)
      if (!tooth || tooth.isEmptySlot) return false
      const hasExtraction = tooth.toothProcedures.some((a) => a.procedure.name === 'Ekstrakcja')
      const hasHideTooth = tooth.toothProcedures.some((a) => a.procedure.behavior === 'HideTooth')
      const hasRootOnly = tooth.toothProcedures.some((a) => a.procedure.behavior === 'RootOnly')
      return !hasExtraction && !hasHideTooth && !hasRootOnly
    })
  )
})

// Context menu handlers
const handleAddTooth = () => {
  if (canAddTooth.value && odontogram?.addToothToEmptySlot) {
    odontogram.addToothToEmptySlot(props.tooth.number)
  }
}

const handleRemoveTooth = () => {
  if (canRemoveTooth.value && odontogram?.removeToothToEmptySlot) {
    odontogram.removeToothToEmptySlot(props.tooth.number)
  }
}

const handleConvertToPrimary = () => {
  if (canConvertToPrimary.value && odontogram?.convertSelectedTeethToPrimary) {
    // First select the tooth, then convert
    odontogram.selectedToothNumbers.value = [props.tooth.number]
    odontogram.convertSelectedTeethToPrimary()
  }
}

const handleConvertToPermanent = () => {
  if (canConvertToPermanent.value && odontogram?.convertSelectedTeethToPermanent) {
    // First select the tooth, then convert
    odontogram.selectedToothNumbers.value = [props.tooth.number]
    odontogram.convertSelectedTeethToPermanent()
  }
}

// Multi-selection handlers
const handleAddSelectedTeeth = () => {
  if (canAddSelectedTeeth.value && odontogram?.addTeethToSelectedEmptySlots) {
    odontogram.addTeethToSelectedEmptySlots()
  }
}

const handleRemoveSelectedTeeth = () => {
  if (canRemoveSelectedTeeth.value && odontogram?.removeSelectedTeeth) {
    odontogram.removeSelectedTeeth()
  }
}

const handleConvertSelectedToPrimary = () => {
  if (canConvertSelectedToPrimary.value && odontogram?.convertSelectedTeethToPrimary) {
    odontogram.convertSelectedTeethToPrimary()
  }
}

const handleConvertSelectedToPermanent = () => {
  if (canConvertSelectedToPermanent.value && odontogram?.convertSelectedTeethToPermanent) {
    odontogram.convertSelectedTeethToPermanent()
  }
}

// Root only handlers
const handleApplyRootOnly = () => {
  if (canApplyRootOnly.value && odontogram?.handleProcedureSelect) {
    // Find the "tylko korzeń" procedure
    const rootOnlyProcedure = odontogram.procedurePalette.value.find(
      (p) => p.name === 'tylko korzeń',
    )
    if (rootOnlyProcedure) {
      // Select this tooth and apply the procedure
      odontogram.selectedToothNumbers.value = [props.tooth.number]
      odontogram.handleProcedureSelect(rootOnlyProcedure)
    }
  }
}

const handleApplyRootOnlyToSelected = () => {
  if (canApplyRootOnlyToSelected.value && odontogram?.handleProcedureSelect) {
    // Find the "tylko korzeń" procedure
    const rootOnlyProcedure = odontogram.procedurePalette.value.find(
      (p) => p.name === 'tylko korzeń',
    )
    if (rootOnlyProcedure) {
      // Apply to all selected teeth
      odontogram.handleProcedureSelect(rootOnlyProcedure)
    }
  }
}
</script>

<style scoped>
/* Fixed layout to match React/Mantine ToothContainer */
.tooth-wrapper {
  /* Main container behaves like Mantine's Stack - vertical flex */
  outline: 2px solid var(--border);
  outline-offset: -1px;
  width: 90px;
  height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  position: relative;
  cursor: pointer;
}

.tooth-wrapper:hover {
  background-color: var(--muted);
}

.selected {
  outline: 2px solid var(--destructive);
  outline-offset: -1px;
  z-index: 2;
  background-color: var(--destructive) / 0.2;
}

/* Empty slot styling - looks like normal slot with subtle indication */
.empty-slot {
  opacity: 0.6;
}

.empty-slot:hover {
  opacity: 0.8;
}

/* Extracted tooth styling - only affects wrapper interaction, not visuals */
.tooth-wrapper--extracted {
  cursor: not-allowed;
}

/* Prevent selection highlighting when extracted */
.tooth-wrapper--extracted.selected {
  outline: 2px solid var(--border);
  background-color: var(--muted) / 0.1;
}

/* Group container that mimics Mantine's Group with h={280} - adaptive layout */
.tooth-group {
  display: flex;
  flex-direction: column; /* Default for Top direction - Schematic at end */
  align-items: center;
  justify-content: start;
  height: 280px;
  width: 100%;
  gap: 4px;
  /* 🎯 REMOVED: No overflow clipping here to avoid cutting off tooth crowns */
}

.tooth-group--bottom {
  flex-direction: column; /* Bottom direction keeps same flex direction but template order changes */
  justify-content: end;
}

/* Single wrapper for all tooth components - KEEP display: contents for layout */
.tooth-components-wrapper {
  position: relative;
  display: contents; /* 🎯 RESTORED: Keep original layout behavior */
  /* 🎯 REMOVED: No overflow clipping here */
}

/* 🎯 Specific wrapper for Tooth component only */
.tooth-only-wrapper {
  position: relative;
  transition: transform 0.3s ease; /* Smooth transition for impacted tooth movement */
  /* 🎯 REMOVED: No overflow clipping here to preserve tooth crowns */
}

/* 🎯 Impacted tooth translations - clipped by parent containers */
.tooth-only-wrapper.impacted-tooth--top {
  transform: translateY(-40px);
}

.tooth-only-wrapper.impacted-tooth--bottom {
  transform: translateY(40px);
}

/* Only block interactions, no visual effects */
.tooth-components-wrapper.extraction-blocked > * {
  pointer-events: none !important;
  cursor: not-allowed !important;
}

/* Invisible overlay that completely blocks mouse events */
.hover-blocker {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 15;
  cursor: not-allowed;
  background: transparent;
  pointer-events: all;
}

/* 🎯 NEW: Dedicated clipping container for tooth component */
.tooth-clip-container {
  position: relative;
  width: 100%;
  height: 140px; /* Increased from 120px to cover full tooth area */
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: -3px; /* Negative margin to eliminate the gap */
}

/* 🎯 NEW: Schematic positioned at end with margin */
.schematic-at-end {
  margin-top: 30px; /* Slight margin to separate from other components */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 🎯 NEW: Bottom direction schematic with margin */
.schematic-at-end--bottom {
  margin-top: 0;
  margin-bottom: 30px; /* Margin for bottom direction */
}

.full-hover-blocker {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 20;
  background: transparent;
  pointer-events: all;
  cursor: not-allowed;
}
.blocker-top {
  /* Leave space for label at the top (approx 32px) */
  top: 32px;
  bottom: 0;
}
.blocker-bottom {
  /* Leave space for label at the bottom (approx 32px) */
  top: 0;
  bottom: 32px;
}
</style>
