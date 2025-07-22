<!-- components/Tooth.vue -->
<template>
      <div
        ref="containerRef"
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
          class="absolute pointer-events-none"
          :style="overlayStyles"
          :width="svgDimensions.width"
          :height="svgDimensions.height"
          :viewBox="svgDimensions.viewBox"
          style="z-index: 10; pointer-events: none"
        >
          <g
            v-for="(pos, idx) in validIconPositions"
            :key="pos.part + idx"
            style="pointer-events: none"
          >
            <foreignObject
              :x="pos.x - 10"
              :y="pos.y - 10"
              width="20"
              height="20"
              style="pointer-events: none"
            >
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
                <ProcedureIcon :icon-name="pos.icon" :icon-source="pos.iconSource" />
              </div>
            </foreignObject>
          </g>
        </svg>
      </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import * as LucideIcons from 'lucide-vue-next'
import DynamicLucideIcon from './DynamicLucideIcon.vue'
import { ToothContainerDirection } from '@/types/odontogram/odontogram'
import type { ProcedureIconSource, ToothProcedureAssignment } from '@/types/odontogram/odontogram'
import { useInteractiveSvg } from '@/composables/odontogram/useInteractiveSvg'
import { getToothSvgComponent } from '@/utils/toothSvgMap'
import { Svg, SVG } from '@svgdotjs/svg.js'
import TablerIcon from './TablerIcon.vue'
import ProcedureIcon from './ProcedureIcon.vue'

interface Props {
  number: string
  toothProcedures: ToothProcedureAssignment[]
  selectedSegments: string[]
  direction: ToothContainerDirection
  onlyRoot?: boolean
  isPediatric?: boolean
}

interface Emits {
  (e: 'segment-click', segmentId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const svgRef = ref<HTMLElement>()
const containerRef = ref<HTMLElement>()

const marginDirection = computed(() => {
  const marginValue = '20px'
  return props.direction === ToothContainerDirection.Bottom
    ? { marginTop: marginValue }
    : { marginBottom: marginValue }
})

const ToothSvgComponent = computed(() => {
  return getToothSvgComponent(props.number, props.isPediatric)
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
  svgRef: svgRef,
  normalizeSegment,
  assignments,
  procedureColors,
  selectedSegments: computed(() => props.selectedSegments),
  onSegmentClick: (segmentId: string) => emit('segment-click', segmentId),
})

// Find all parts with a procedure that has visualType 'Icon'
const iconParts = computed(() => {
  return props.toothProcedures.filter((a) => a.procedure.visual.visualType === 'Icon')
})

const iconPositions = ref<
  {
    part: string
    icon: string
    x: number
    y: number
    bbox?: { x: number; y: number; width: number; height: number }
    iconSource: ProcedureIconSource
  }[]
>([])

const svgDimensions = ref({ width: 0, height: 0, viewBox: '0 0 0 0' })
const svgOffset = ref({ x: 0, y: 0 })

// Computed style for overlay positioning that accounts for transforms and margins
const overlayStyles = computed(() => {
  const marginValue = 20 // 20px margin from marginDirection
  const offset =
    props.direction === ToothContainerDirection.Bottom
      ? { top: `${marginValue}px`, left: '0px' }
      : { bottom: `${marginValue}px`, left: '0px' }

  return {
    ...offset,
    transform: 'none', // Reset any inherited transforms
  }
})

const getTransformedBoundingBox = (element: SVGGraphicsElement, svgElement: SVGSVGElement) => {
  try {
    // Get the bounding box in the SVG coordinate system
    const bbox = element.getBBox()

    // Get the CTM (Current Transformation Matrix) to account for any transforms
    const ctm = element.getCTM() || svgElement.createSVGMatrix()

    // Transform the bounding box corners
    const topLeft = svgElement.createSVGPoint()
    topLeft.x = bbox.x
    topLeft.y = bbox.y
    const transformedTopLeft = topLeft.matrixTransform(ctm)

    const bottomRight = svgElement.createSVGPoint()
    bottomRight.x = bbox.x + bbox.width
    bottomRight.y = bbox.y + bbox.height
    const transformedBottomRight = bottomRight.matrixTransform(ctm)

    // Calculate center point
    const center = svgElement.createSVGPoint()
    center.x = bbox.x + bbox.width / 2
    center.y = bbox.y + bbox.height / 2
    const transformedCenter = center.matrixTransform(ctm)

    return {
      x: transformedTopLeft.x,
      y: transformedTopLeft.y,
      width: transformedBottomRight.x - transformedTopLeft.x,
      height: transformedBottomRight.y - transformedTopLeft.y,
      cx: transformedCenter.x,
      cy: transformedCenter.y,
    }
  } catch (error) {
    console.warn('Error getting transformed bounding box:', error)
    // Fallback to basic bbox
    const bbox = element.getBBox()
    return {
      x: bbox.x,
      y: bbox.y,
      width: bbox.width,
      height: bbox.height,
      cx: bbox.x + bbox.width / 2,
      cy: bbox.y + bbox.height / 2,
    }
  }
}

const updateIconPositions = () => {
  let svgEl = svgRef.value as any
  if (svgEl && svgEl.$el) svgEl = svgEl.$el
  if (svgEl && svgEl.tagName !== 'svg') {
    svgEl = svgEl.querySelector && svgEl.querySelector('svg')
  }
  if (!svgEl || typeof svgEl.querySelector !== 'function') {
    console.warn('[Tooth.vue] Could not find SVG element')
    return
  }

  const newPositions: {
    part: string
    icon: string
    x: number
    y: number
    bbox?: { x: number; y: number; width: number; height: number }
    iconSource: ProcedureIconSource
  }[] = []

  iconParts.value.forEach((assignment) => {
    const partId = assignment.toothPart.toLowerCase()
    let el = svgEl.querySelector(`#tooth_${props.number}_${partId}`) as SVGGraphicsElement | null
    if (!el) {
      el = svgEl.querySelector(`[id$='_${partId}']`) as SVGGraphicsElement | null
    }
    if (!el) {
      console.warn(`[Tooth.vue] Could not find SVG element for icon part:`, partId)
      return
    }

    // Use native SVG methods to get properly transformed coordinates
    const transformedBBox = getTransformedBoundingBox(el, svgEl)

    newPositions.push({
      part: assignment.toothPart,
      icon: assignment.procedure.visual.value!,
      x: transformedBBox.cx,
      y: transformedBBox.cy,
      bbox: {
        x: transformedBBox.x,
        y: transformedBBox.y,
        width: transformedBBox.width,
        height: transformedBBox.height,
      },
      iconSource: assignment.procedure.visual.iconSource!,
    })
  })

  iconPositions.value = newPositions
}

function updateSvgDimensions() {
  let svgEl = svgRef.value as any
  if (svgEl && svgEl.$el) svgEl = svgEl.$el
  if (svgEl && svgEl.tagName !== 'svg') {
    svgEl = svgEl.querySelector && svgEl.querySelector('svg')
  }
  if (!svgEl) return

  // Get the actual rendered dimensions
  const rect = svgEl.getBoundingClientRect()
  const computedStyle = window.getComputedStyle(svgEl)

  // Use the SVG's actual dimensions, accounting for any CSS scaling
  svgDimensions.value.width =
    svgEl.width?.baseVal?.value ||
    parseFloat(svgEl.getAttribute('width')) ||
    svgEl.clientWidth ||
    rect.width

  svgDimensions.value.height =
    svgEl.height?.baseVal?.value ||
    parseFloat(svgEl.getAttribute('height')) ||
    svgEl.clientHeight ||
    rect.height

  svgDimensions.value.viewBox =
    svgEl.getAttribute('viewBox') ||
    `0 0 ${svgDimensions.value.width} ${svgDimensions.value.height}`

  // Calculate the offset of the SVG element relative to its container
  if (containerRef.value) {
    const containerRect = containerRef.value.getBoundingClientRect()
    svgOffset.value = {
      x: rect.left - containerRect.left,
      y: rect.top - containerRect.top,
    }
  }
}

const validIconPositions = computed(() => iconPositions.value.filter((pos) => pos.bbox))

onMounted(() => {
  nextTick(() => {
    updateSvgDimensions()
    updateIconPositions()
    // Hide implants for pediatric teeth (any element with id containing 'implant')
    if (props.isPediatric) {
      let svgEl = svgRef.value as any
      if (svgEl && svgEl.$el) svgEl = svgEl.$el
      if (svgEl && svgEl.tagName !== 'svg') {
        svgEl = svgEl.querySelector && svgEl.querySelector('svg')
      }
      if (svgEl && typeof svgEl.querySelectorAll === 'function') {
        const implantElements = svgEl.querySelectorAll('[id*="implant"]')
        implantElements.forEach((el: any) => {
          el.style.display = 'none'
        })
      }
    }
  })
})

watch([iconParts, () => props.number], () =>
  nextTick(() => {
    updateSvgDimensions()
    updateIconPositions()
  }),
)

// Watch for container size changes (useful for responsive behavior)
watch([containerRef], () => {
  if (containerRef.value) {
    const resizeObserver = new ResizeObserver(() => {
      nextTick(() => {
        updateSvgDimensions()
        updateIconPositions()
      })
    })
    resizeObserver.observe(containerRef.value)

    // Clean up observer on unmount
    return () => resizeObserver.disconnect()
  }
})
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
