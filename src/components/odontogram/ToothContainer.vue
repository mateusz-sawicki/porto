<!-- components/ToothContainer.vue - Fixed Layout to Match React/Mantine Original -->
<template>
  <Popover :open="showTooltip">
    <PopoverTrigger asChild>
      <div
        class="tooth-wrapper"
        :class="{ selected: isSelected }"
        @click="handleToothClick"
        @mouseenter="hoveredTooth = tooth.number"
        @mouseleave="hoveredTooth = null"
      >
        <!-- Extraction Overlay -->
        <ExtractionOverlay v-if="extraction" />

        <!-- Main Group Container (equivalent to Mantine's Group with h={280}) -->
        <div
          class="tooth-group"
          :class="{ 'tooth-group--bottom': direction === ToothContainerDirection.Bottom }"
        >
          <template v-if="direction === ToothContainerDirection.Top">
            <ToothLabel
              :toothNumber="tooth.number"
              :isExtra="isExtra"
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
            <GumOverlay :direction="direction" :hasCutout="hasExposedToothProcedure" />
            <Tooth
              :number="tooth.number"
              :toothProcedures="tooth.toothProcedures"
              :selectedSegments="selectedSegments"
              :direction="direction"
              @segment-click="$emit('segment-click', $event)"
            />
            <Schematic
              :number="tooth.number"
              :schemaProcedures="tooth.schemaProcedures"
              :selectedSegments="selectedSegments"
              :direction="direction"
              @segment-click="$emit('segment-click', $event)"
            />
          </template>
          <template v-else>
            <Schematic
              :number="tooth.number"
              :schemaProcedures="tooth.schemaProcedures"
              :selectedSegments="selectedSegments"
              :direction="direction"
              @segment-click="$emit('segment-click', $event)"
            />
            <GumOverlay :direction="direction" :hasCutout="hasExposedToothProcedure" />
            <Tooth
              :number="tooth.number"
              :toothProcedures="tooth.toothProcedures"
              :selectedSegments="selectedSegments"
              :direction="direction"
              @segment-click="$emit('segment-click', $event)"
            />
            <ToothLabel
              :toothNumber="tooth.number"
              :isExtra="isExtra"
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
          </template>
        </div>
      </div>
    </PopoverTrigger>

    <PopoverContent v-if="assignedToothLevelProcedures.length > 0" class="w-auto">
      {{ assignedToothLevelProcedures.map((p) => p.procedure.name).join(', ') }}
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { ToothData } from '@/types/odontogram/odontogram'
import { ToothContainerDirection, ExtraToothDirection } from '@/types/odontogram/odontogram'
import ExtractionOverlay from './ExtractionOverlay.vue'
import GumOverlay from './GumOverlay.vue'
import Tooth from './Tooth.vue'
import Schematic from './Schematic.vue'
import ToothLabel from './ToothLabel.vue'

interface Props {
  tooth: ToothData
  isSelected: boolean
  selectedSegments: string[]
  direction: ToothContainerDirection
}

interface Emits {
  (e: 'tooth-click'): void
  (e: 'segment-click', segmentId: string): void
  (e: 'add-extra-tooth', event: { base: string; direction: ExtraToothDirection }): void
  (e: 'remove-tooth', number: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const hoveredTooth = ref<string | null>(null)

const isExtra = computed(() => props.tooth.number.includes('+') || props.tooth.number.includes('-'))

const assignedToothLevelProcedures = computed(() =>
  props.tooth.toothProcedures.filter((a) => a.toothPart.toLowerCase() === 'tooth'),
)

const extraction = computed(() =>
  assignedToothLevelProcedures.value.find(
    (a) => a.procedure.name === 'Ekstrakcja' && a.procedure.visual.visualType === 'Icon',
  ),
)

const hasExposedToothProcedure = computed(() =>
  assignedToothLevelProcedures.value.some(
    (p) => p.procedure.name === 'Recesja' && p.procedure.visual.visualType === 'GumShape',
  ),
)

const showTooltip = computed(
  () => hoveredTooth.value === props.tooth.number && assignedToothLevelProcedures.value.length > 0,
)

const handleToothClick = () => {
  emit('tooth-click')
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

/* Group container that mimics Mantine's Group with h={280} - adaptive layout */
.tooth-group {
  display: flex;
  flex-direction: column; /* Default for Top direction - Schematic at end */
  align-items: center;
  justify-content: start;
  height: 280px;
  width: 100%;
  gap: 4px;
}

.tooth-group--bottom {
  flex-direction: column; /* Bottom direction keeps same flex direction but template order changes */
  justify-content: end;
}

/* Ensure the extraction overlay covers the entire tooth wrapper */
.tooth-wrapper > :first-child {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

/* Ensure the tooth group is above the extraction overlay */
.tooth-group {
  z-index: 2;
  position: relative;
}
</style>
