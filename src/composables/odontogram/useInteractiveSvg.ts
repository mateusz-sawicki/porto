// composables/useInteractiveSvg.ts
import { ref, computed, watch, onMounted, onUnmounted, type Ref, type ComputedRef } from 'vue'

interface UseInteractiveSvgParams {
  svgRef: Ref<HTMLElement | SVGSVGElement | undefined>
  normalizeSegment: (id: string) => string
  assignments: ComputedRef<Record<string, any[]>>
  procedureColors: ComputedRef<Record<string, string>>
  selectedSegments: ComputedRef<string[]>
  onSegmentClick: (segmentId: string) => void
}

export function useInteractiveSvg({
  svgRef,
  normalizeSegment,
  assignments,
  procedureColors,
  selectedSegments,
  onSegmentClick,
}: UseInteractiveSvgParams) {
  const hoveredSegment = ref<string | null>(null)
  const showTooltip = ref(false)

  const assignedProcedures = computed(() =>
    hoveredSegment.value ? assignments.value[hoveredSegment.value] : null,
  )

  const groupPathsBySegment = (
    element: HTMLElement | SVGSVGElement,
  ): Record<string, SVGPathElement[]> => {
    const pathGroups: Record<string, SVGPathElement[]> = {}
    const paths = element.querySelectorAll('path')

    paths.forEach((path) => {
      const segmentId = path.id
      if (!segmentId) return

      const fullId = normalizeSegment(segmentId)
      if (!pathGroups[fullId]) pathGroups[fullId] = []
      pathGroups[fullId].push(path)
    })

    return pathGroups
  }

  const applyFillStyle = (
    path: SVGPathElement,
    assigned: any[] | undefined,
    isSelected: boolean,
  ) => {
    path.classList.remove('selected')

    if (!path.dataset.originalFill) {
      path.dataset.originalFill = path.style.fill || 'transparent'
    }

    const color = assigned?.[0] && procedureColors.value[assigned[0].name]

    if (isSelected) {
      path.style.fill = ''
      path.classList.add('selected')
    } else {
      path.style.fill = color ?? path.dataset.originalFill ?? 'transparent'
    }
  }

  const attachSegmentEvents = (path: SVGPathElement, fullId: string) => {
    const handleClick = (e: Event) => {
      e.stopPropagation()
      onSegmentClick(fullId)
    }

    const handleMouseEnter = () => {
      hoveredSegment.value = fullId
      showTooltip.value = !!assignments.value[fullId]?.length
    }

    const handleMouseLeave = () => {
      hoveredSegment.value = null
      showTooltip.value = false
    }

    path.addEventListener('click', handleClick)
    path.addEventListener('mouseenter', handleMouseEnter)
    path.addEventListener('mouseleave', handleMouseLeave)

    // Store event handlers for cleanup
    ;(path as any).__eventHandlers = {
      click: handleClick,
      mouseenter: handleMouseEnter,
      mouseleave: handleMouseLeave,
    }
  }

  const removeSegmentEvents = (path: SVGPathElement) => {
    const handlers = (path as any).__eventHandlers
    if (handlers) {
      path.removeEventListener('click', handlers.click)
      path.removeEventListener('mouseenter', handlers.mouseenter)
      path.removeEventListener('mouseleave', handlers.mouseleave)
      delete (path as any).__eventHandlers
    }
  }

  const bindSvgPaths = (element: HTMLElement | SVGSVGElement) => {
    // Clean up previous event listeners
    const allPaths = element.querySelectorAll('path')
    allPaths.forEach(removeSegmentEvents)

    const pathGroups = groupPathsBySegment(element)

    Object.entries(pathGroups).forEach(([fullId, group]) => {
      const isSelected = selectedSegments.value.includes(fullId)
      const assigned = assignments.value[fullId]

      group.forEach((path) => {
        path.setAttribute('cursor', 'pointer')
        applyFillStyle(path, assigned, isSelected)
        attachSegmentEvents(path, fullId)
      })
    })
  }

  const updateSvg = () => {
    if (!svgRef.value) return
    bindSvgPaths(svgRef.value)
  }

  // Watch for changes and update SVG
  watch([assignments, procedureColors, selectedSegments], updateSvg, { deep: true })

  onMounted(() => {
    updateSvg()
  })

  onUnmounted(() => {
    // Clean up event listeners
    if (svgRef.value) {
      const allPaths = svgRef.value.querySelectorAll('path')
      allPaths.forEach(removeSegmentEvents)
    }
  })

  return {
    hoveredSegment,
    assignedProcedures,
    showTooltip,
  }
}
