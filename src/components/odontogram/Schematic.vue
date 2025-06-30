<!-- Current Schematic.vue - Already Set Up! -->
<template>
  <Popover :open="showTooltip">
    <PopoverTrigger asChild>
      <div class="w-full flex justify-center items-center" :class="marginFromCenter">
        <!-- 🎯 THIS IS WHERE YOUR SCHEMATIC SVG GETS RENDERED -->
        <component
          v-if="SchematicSvgComponent"
          :is="SchematicSvgComponent"
          ref="svgRef"
          class="schematic-svg"
        />

        <!-- Fallback when no SVG available -->
        <div
          v-else
          ref="svgRef"
          class="schematic-svg w-12 h-12 border border-dashed border-gray-400 rounded flex items-center justify-center text-xs text-gray-600"
        >
          {{ getToothType(number)[0].toUpperCase() }}
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
import type { SchemaProcedureAssignment } from '@/types/odontogram/odontogram'
import { useInteractiveSvg } from '@/composables/odontogram/useInteractiveSvg'

// 🎯 THIS IS THE KEY LINE - IMPORTS FROM YOUR CENTRALIZED SCHEMATIC MAP
import { getSchematicSvgComponent } from '@/utils/schematicSvgMap'

interface Props {
  number: string
  schemaProcedures: SchemaProcedureAssignment[]
  selectedSegments: string[]
  direction: ToothContainerDirection
}

interface Emits {
  (e: 'segment-click', segmentId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const svgRef = ref<HTMLElement | SVGSVGElement>()

// 🎯 THIS DETERMINES IF TOOTH IS MOLAR OR INCISOR
const getToothType = (number: string): 'molar' | 'incisor' => {
  const molars = ['16', '17', '18', '26', '27', '28', '36', '37', '38', '46', '47', '48']
  return molars.includes(number.replace(/[+-]\d+$/, '')) ? 'molar' : 'incisor'
}

// 🎯 THIS GETS YOUR SCHEMATIC SVG COMPONENT FROM THE MAP
const SchematicSvgComponent = computed(() => {
  const type = getToothType(props.number)
  return getSchematicSvgComponent(type)
})

const marginFromCenter = computed(() => {
  return props.direction === ToothContainerDirection.Bottom ? 'mt-[15px]' : 'mb-[15px]'
})

// Interactive SVG logic for surface clicks (mesial, distal, buccal, lingual)
const normalizeSegment = (id: string): string => `${props.number}_${id}`

const assignments = computed(() => {
  const result: Record<string, any[]> = {}
  props.schemaProcedures.forEach((a) => {
    const key = `${props.number}_${a.surface.toLowerCase()}`
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
  svgRef,
  normalizeSegment,
  assignments,
  procedureColors,
  selectedSegments: computed(() => props.selectedSegments),
  onSegmentClick: (segmentId: string) => emit('segment-click', segmentId),
})
</script>

<style scoped>
/* 🎯 THESE STYLES MAKE YOUR SCHEMATIC SVG INTERACTIVE */
.schematic-svg :deep(path) {
  fill: transparent;
  stroke: var(--border);
  stroke-width: 0.35px;
  transition: fill 0.2s ease;
  cursor: pointer;
}

.schematic-svg :deep(path:hover) {
  fill: var(--blue-200) !important;
}
</style>
