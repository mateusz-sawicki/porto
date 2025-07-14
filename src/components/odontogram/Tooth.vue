<!-- components/Tooth.vue -->
<template>
  <Popover :open="showTooltip">
    <PopoverTrigger asChild>
      <div
        class="flex h-[125px] scale-[1.2] max-w-[75px] relative"
        :class="[
          direction === ToothContainerDirection.Top
            ? 'flex-row items-end justify-end mt-2'
            : 'flex-col items-start justify-start mb-2',
        ]"
      >
        <!-- 🎯 THIS IS WHERE YOUR SVG GETS RENDERED -->
        <component
          v-if="ToothSvgComponent"
          :is="ToothSvgComponent"
          ref="svgRef"
          class="tooth-svg"
          :style="marginDirection"
          v-bind="onlyRoot ? { onlyRoot: true } : {}"
        />

        <!-- Overlay bounding box and icon for observation procedures -->
        <svg
          v-if="validIconPositions.length > 0"
          class="absolute left-0 top-0 pointer-events-none"
          :width="svgDimensions.width"
          :height="svgDimensions.height"
          :viewBox="svgDimensions.viewBox"
          style="z-index: 10; pointer-events: none;"
        >
          <g v-for="(pos, idx) in validIconPositions" :key="pos.part + idx" style="pointer-events: none;">
            <rect
              :x="pos.bbox.x"
              :y="pos.bbox.y"
              :width="pos.bbox.width"
              :height="pos.bbox.height"
              fill="none"
              stroke="#3b82f6"
              stroke-width="1.5"
              stroke-dasharray="4 2"
              style="pointer-events: none;"
            />
            <foreignObject :x="pos.x - 10" :y="pos.y - 10" width="20" height="20" style="pointer-events: none;">
              <div
                style="
                  width: 20px;
                  height: 20px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  pointer-events: none;
                "
              >
                <span class="w-5 h-5 text-blue-600 opacity-80" style="pointer-events: none;">👁</span>
              </div>
            </foreignObject>
          </g>
        </svg>

        <!-- Fallback when no SVG available (removed) -->
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
import type { ToothProcedureAssignment } from '@/types/odontogram/odontogram'
import { useInteractiveSvg } from '@/composables/odontogram/useInteractiveSvg'
import { getToothSvgComponent } from '@/utils/toothSvgMap'
import { Svg, SVG } from '@svgdotjs/svg.js'

interface Props {
  number: string
  toothProcedures: ToothProcedureAssignment[]
  selectedSegments: string[]
  direction: ToothContainerDirection
  onlyRoot?: boolean // Add prop for only-root
}

interface Emits {
  (e: 'segment-click', segmentId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Use the original ref approach but with better handling
const svgRef = ref<HTMLElement>()

const marginDirection = computed(() => {
  const marginValue = '20px'
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

// Observation logic for bounding box and icon
const observedParts = computed(() => {
  return props.toothProcedures.filter((a) => a.procedure.name === 'Obserwacja')
})

const iconPositions = ref<
  {
    part: string
    x: number
    y: number
    bbox?: { x: number; y: number; width: number; height: number }
  }[]
>([])

const svgDimensions = ref({ width: 0, height: 0, viewBox: '0 0 0 0' })

const updateIconPositions = () => {
  let svgEl = svgRef.value as any
  if (svgEl && svgEl.$el) svgEl = svgEl.$el
  if (svgEl && svgEl.tagName !== 'svg') svgEl = svgEl.querySelector && svgEl.querySelector('svg')
  if (!svgEl || typeof svgEl.querySelector !== 'function') return
  const svgjs = SVG(svgEl)
  const newPositions: {
    part: string
    x: number
    y: number
    bbox?: { x: number; y: number; width: number; height: number }
  }[] = []
  observedParts.value.forEach((obs) => {
    const partId = obs.toothPart.toLowerCase()
    let el = svgEl.querySelector(`[id$='_${partId}']`) as SVGGraphicsElement | null
    if (el && el.tagName === 'g' && partId === 'root') {
      // For root, use the group's bounding box (covers all child paths)
      const bbox = el.getBBox();
      const centerX = bbox.x + bbox.width / 2;
      const centerY = bbox.y + bbox.height / 2;
      newPositions.push({
        part: obs.toothPart,
        x: centerX,
        y: centerY,
        bbox: { x: bbox.x, y: bbox.y, width: bbox.width, height: bbox.height },
      });
      return;
    }
    if (el && el instanceof SVGPathElement) {
      const bbox = el.getBBox();
      const centerX = bbox.x + bbox.width / 2;
      const centerY = bbox.y + bbox.height / 2;
      newPositions.push({
        part: obs.toothPart,
        x: centerX,
        y: centerY,
        bbox: { x: bbox.x, y: bbox.y, width: bbox.width, height: bbox.height },
      });
      return;
    }
    // fallback: if el is a group but not root, try to find a path inside
    if (el && el.tagName === 'g') {
      const pathInGroup = el.querySelector('path') as SVGPathElement | null;
      if (pathInGroup) {
        const bbox = pathInGroup.getBBox();
        const centerX = bbox.x + bbox.width / 2;
        const centerY = bbox.y + bbox.height / 2;
        newPositions.push({
          part: obs.toothPart,
          x: centerX,
          y: centerY,
          bbox: { x: bbox.x, y: bbox.y, width: bbox.width, height: bbox.height },
        });
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

const validIconPositions = computed(() => iconPositions.value.filter(pos => pos.bbox))

onMounted(() => {
  nextTick(() => {
    updateSvgDimensions()
    updateIconPositions()
  })
})
watch([observedParts, () => props.number], () => nextTick(() => {
  updateSvgDimensions()
  updateIconPositions()
}))
</script>

<style scoped>
.tooth-svg :deep(path) {
  fill: transparent;
  stroke: var(--border);
  stroke-width: 1px;
  cursor: pointer;
  transition: fill 0.2s ease;
}

/* 🎯 HOVER FOR ROOT PARTS - handles both individual paths and paths in groups */
.tooth-svg :deep(path[id*='root']:hover),
.tooth-svg :deep(g[id*='root']:hover path) {
  fill: var(--destructive) !important; /* Red-ish for root */
}

/* 🎯 HOVER FOR CROWN PARTS */
.tooth-svg :deep(path[id*='crown']:hover) {
  fill: var(--primary) !important; /* Primary color for crown */
}

/* 🎯 SELECTED STATES */
.tooth-svg :deep(path.selected) {
  fill: var(--primary) !important;
  stroke: var(--primary-foreground) !important;
  stroke-width: 2px !important;
}

/* 🎯 SELECTED HOVER STATES */
.tooth-svg :deep(path[id*='root'].selected:hover),
.tooth-svg :deep(g[id*='root'] path.selected:hover) {
  fill: var(--destructive/90) !important;
}

.tooth-svg :deep(path[id*='crown'].selected:hover) {
  fill: var(--primary/90) !important;
}

/* 🎯 SPECIFIC HOVER FOR ROOT GROUP (for molars) */
.tooth-svg :deep(g[id*='root']:hover) {
  cursor: pointer;
}

/* 🎯 HIDE IMPLANT GROUPS BY DEFAULT */
.tooth-svg :deep(g[id*='implant']) {
  display: none !important;
}

/* Only show root if onlyRoot is set on the SVG */
.tooth-svg[onlyRoot] :deep(path[id*='crown']),
.tooth-svg[onlyRoot] :deep(g[id*='crown']) {
  display: none !important;
}

/* Alternative approach - hide all non-root parts */
.tooth-svg[onlyRoot] :deep(path:not([id*='root'])),
.tooth-svg[onlyRoot] :deep(g:not([id*='root'])) {
  display: none !important;
}
</style>
