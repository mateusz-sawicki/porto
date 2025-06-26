<!-- components/ToothContainer.vue -->
<template>
  <Popover :open="showTooltip">
    <PopoverTrigger asChild>
      <div
        class="relative w-[90px] h-[280px] flex items-center justify-between transition-colors duration-200 cursor-pointer outline-2 outline-offset-[-1px] outline-border hover:bg-muted"
        :class="{
          'outline-red-500 z-[2] bg-red-500/20': isSelected,
        }"
        @click="handleToothClick"
        @mouseenter="hoveredTooth = tooth.number"
        @mouseleave="hoveredTooth = null"
      >
        <!-- Extraction Overlay -->
        <ExtractionOverlay v-if="extraction" />

        <!-- Tooth Content -->
        <div class="h-[280px] flex items-center justify-center">
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
