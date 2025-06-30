<!-- components/Tooth.vue -->
<template>
  <Popover :open="showTooltip">
    <PopoverTrigger asChild>
      <div
        class="flex h-[125px] scale-[1.2] max-w-[75px]"
        :class="[
          direction === ToothContainerDirection.Top
            ? 'flex-row items-end justify-end'
            : 'flex-col items-start justify-start',
        ]"
      >
        <!-- 🎯 THIS IS WHERE YOUR SVG GETS RENDERED -->
        <component
          v-if="ToothSvgComponent"
          :is="ToothSvgComponent"
          ref="svgRef"
          class="tooth-svg"
          :style="marginDirection"
        />

        <!-- Fallback when no SVG available -->
        <div
          v-else
          ref="svgRef"
          class="tooth-svg w-16 h-16 border border-dashed border-gray-300 rounded flex items-center justify-center text-xs text-gray-500"
          :style="marginDirection"
        >
          {{ number }}
        </div>
      </div>
    </PopoverTrigger>

    <PopoverContent v-if="assignedProcedures?.length" class="w-auto">
      {{ assignedProcedures.map((p) => p.name).join(', ') }}
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ToothContainerDirection } from '@/types/odontogram/odontogram'
import type { ToothProcedureAssignment } from '@/types/odontogram/odontogram'
import { useInteractiveSvg } from '@/composables/odontogram/useInteractiveSvg'
import { getToothSvgComponent } from '@/utils/toothSvgMap'

interface Props {
  number: string
  toothProcedures: ToothProcedureAssignment[]
  selectedSegments: string[]
  direction: ToothContainerDirection
}

interface Emits {
  (e: 'segment-click', segmentId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Use the original ref approach but with better handling
const svgRef = ref<HTMLElement>()

const marginDirection = computed(() => {
  const marginValue = '15px'
  return props.direction === ToothContainerDirection.Bottom
    ? { marginTop: marginValue }
    : { marginBottom: marginValue }
})

const ToothSvgComponent = computed(() => {
  return getToothSvgComponent(props.number) // Gets SVG for tooth "11", "16", etc.
})

// Interactive SVG logic
const normalizeSegment = (id: string): string => {
  if (id.includes('root')) return `${props.number}_root`
  if (id.includes('crown')) return `${props.number}_crown`
  return `${props.number}_${id}`
}

const assignments = computed(() => {
  const result: Record<string, any[]> = {}
  props.toothProcedures.forEach((a) => {
    const key = `${props.number}_${a.toothPart.toLowerCase()}`
    if (!result[key]) result[key] = []
    result[key].push(a.procedure)
  })
  return result
})

const procedureColors = computed(() => {
  const colors: Record<string, string> = {}
  Object.values(assignments.value)
    .flat()
    .forEach((p: any) => {
      if (p.visual.visualType === 'Color') {
        colors[p.name] = p.visual.value
      }
    })
  return colors
})

const { assignedProcedures, showTooltip } = useInteractiveSvg({
  svgRef: svgRef, // Back to original ref
  normalizeSegment,
  assignments,
  procedureColors,
  selectedSegments: computed(() => props.selectedSegments),
  onSegmentClick: (segmentId: string) => emit('segment-click', segmentId),
})
</script>

<style scoped>
.tooth-svg :deep(path) {
  fill: transparent;
  stroke: black;
  cursor: pointer;
  transition: fill 0.2s ease;
}

.tooth-svg :deep(.root:hover path),
.tooth-svg :deep(.root:hover),
.tooth-svg :deep(.crown:hover) {
  fill: hsl(var(--blue-200)) !important;
}

.tooth-svg :deep(g.root:hover path) {
  fill: hsl(var(--blue-200)) !important;
}

.tooth-svg :deep(path.selected) {
  fill: hsl(var(--primary)) !important;
  stroke: hsl(var(--primary-foreground));
  stroke-width: 2;
}
</style>
