<!-- Current Schematic.vue - Already Set Up! -->
<template>
  <Popover :open="showTooltip">
    <PopoverTrigger asChild>
      <div class="w-full flex justify-center items-center relative" :class="marginFromCenter">
        <!-- SVG SCHEMATIC RENDERING -->
        <component
          v-if="SchematicSvgComponent"
          :is="SchematicSvgComponent"
          ref="svgRef"
          class="schematic-svg"
        />
        <!-- Overlay Lucide Eye icons at observed surface centers (only if needed) -->
        <svg
          v-if="iconPositions.length > 0"
          class="absolute left-0 top-0 pointer-events-none"
          :width="svgDimensions.width"
          :height="svgDimensions.height"
          :viewBox="svgDimensions.viewBox"
          style="z-index: 10"
        >
          <g v-for="(pos, idx) in iconPositions" :key="pos.surface + idx">
            <foreignObject :x="pos.x - 10" :y="pos.y - 10" width="20" height="20">
              <div
                style="
                  width: 20px;
                  height: 20px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                <ProcedureIcon :icon-name="pos.icon" :icon-source="pos.iconSource" />
              </div>
            </foreignObject>
          </g>
        </svg>
        <!-- Fallback when no SVG available -->
        <div
          v-else-if="!SchematicSvgComponent"
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
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ToothContainerDirection } from '@/types/odontogram/odontogram'
import type { SchemaProcedureAssignment } from '@/types/odontogram/odontogram'
import { useInteractiveSvg } from '@/composables/odontogram/useInteractiveSvg'
import { getSchematicSvgComponent } from '@/utils/schematicSvgMap'
import * as LucideIcons from 'lucide-vue-next'
import { Svg, SVG } from '@svgdotjs/svg.js'
import ProcedureIcon from './ProcedureIcon.vue'
import { ProcedureIconSource } from '@/types/odontogram/odontogram'

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

// Find all surfaces with a procedure that has visualType 'Icon'
const iconSurfaces = computed(() => {
  return props.schemaProcedures.filter((a) => a.procedure.visual.visualType === 'Icon')
})

// Store icon positions for each observed surface
const iconPositions = ref<
  {
    surface: string
    icon: string
    iconSource: ProcedureIconSource
    x: number
    y: number
    bbox?: { x: number; y: number; width: number; height: number }
  }[]
>([])

const svgDimensions = ref({ width: 0, height: 0, viewBox: '0 0 0 0' })

function getPathVisualCentroid(path: SVGPathElement) {
  const len = path.getTotalLength()
  const samples = 200
  let sumX = 0,
    sumY = 0
  for (let i = 0; i < samples; i++) {
    const pt = path.getPointAtLength((i / (samples - 1)) * len)
    sumX += pt.x
    sumY += pt.y
  }
  return { x: sumX / samples, y: sumY / samples }
}

const updateIconPositions = () => {
  let svgEl = svgRef.value as any
  // If using a Vue component, get the underlying SVG element
  if (svgEl && svgEl.$el) {
    svgEl = svgEl.$el
  }
  // If still not an SVG element, try to find the <svg> inside
  if (svgEl && svgEl.tagName !== 'svg') {
    svgEl = svgEl.querySelector && svgEl.querySelector('svg')
  }
  if (!svgEl || typeof svgEl.querySelector !== 'function') return
  const svgjs = SVG(svgEl)
  const newPositions: {
    surface: string
    icon: string
    iconSource: ProcedureIconSource
    x: number
    y: number
    bbox?: { x: number; y: number; width: number; height: number }
  }[] = []
  iconSurfaces.value.forEach((assignment) => {
    // Use just the surface name as the ID
    const surfaceId = assignment.surface.toLowerCase()
    let el = svgEl.querySelector(`#${surfaceId}`) as SVGGraphicsElement | null
    // If el is a group, try to find a path inside
    if (el && el.tagName === 'g') {
      const pathInGroup = el.querySelector('path') as SVGPathElement | null
      if (pathInGroup) {
        el = pathInGroup
      }
    }
    if (el) {
      const svgjsEl = svgjs.findOne(`#${el.id}`) as Svg
      if (svgjsEl) {
        const bbox = svgjsEl.bbox()
        newPositions.push({
          surface: assignment.surface,
          icon: assignment.procedure.visual.value,
          iconSource: assignment.procedure.visual.iconSource,
          x: bbox.cx,
          y: bbox.cy,
          bbox: { x: bbox.x, y: bbox.y, width: bbox.width, height: bbox.height },
        })
      }
    }
  })
  iconPositions.value = newPositions
}

function updateSvgDimensions() {
  let svgEl = svgRef.value as any
  if (svgEl && svgEl.$el) svgEl = svgEl.$el
  if (svgEl && svgEl.tagName !== 'svg') svgEl = svgEl.querySelector && svgEl.querySelector('svg')
  if (!svgEl) return
  svgDimensions.value.width = svgEl.width?.baseVal?.value || svgEl.getAttribute('width') || 0
  svgDimensions.value.height = svgEl.height?.baseVal?.value || svgEl.getAttribute('height') || 0
  svgDimensions.value.viewBox = svgEl.getAttribute('viewBox') || ''
}

onMounted(() => {
  nextTick(() => {
    updateSvgDimensions()
    updateIconPositions()
  })
})
watch([iconSurfaces, () => props.number], () =>
  nextTick(() => {
    updateSvgDimensions()
    updateIconPositions()
  }),
)
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
  fill: var(--primary) !important;
}

/* 🎯 THEME-ADAPTIVE STYLES FOR SELECTED SEGMENTS */
.schematic-svg :deep(path.selected) {
  fill: var(--primary) !important;
  stroke: var(--primary-foreground) !important;
  stroke-width: 1px !important;
}

/* 🎯 SELECTED HOVER STATE */
.schematic-svg :deep(path.selected:hover) {
  fill: var(--primary/90) !important;
}
</style>
