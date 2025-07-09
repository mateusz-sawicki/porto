// composables/useInteractiveSvg.ts
import {
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted,
  nextTick,
  type Ref,
  type ComputedRef,
} from 'vue'

interface UseInteractiveSvgParams {
  svgRef: Ref<HTMLElement | SVGSVGElement | any | undefined>
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

  // Helper function to get the actual DOM element from the ref
  const getDomElement = (): HTMLElement | SVGSVGElement | null => {
    const element = svgRef.value

    if (!element) {
      return null
    }

    // If it's already a DOM element, return it
    if (element instanceof HTMLElement || element instanceof SVGSVGElement) {
      return element
    }

    // If it's a Vue component instance, try to get the root element
    if (element.$el) {
      return element.$el
    }

    // If it has a _vnode property (Vue 3 component), try to get the element
    if (element._vnode?.el) {
      return element._vnode.el
    }

    // Last resort: check if it has a querySelector method (might be a wrapper)
    if (typeof element.querySelector === 'function') {
      return element
    }

    console.warn('useInteractiveSvg: Could not extract DOM element from ref')
    return null
  }

  const groupPathsBySegment = (
    element: HTMLElement | SVGSVGElement,
  ): Record<string, SVGPathElement[]> => {
    const pathGroups: Record<string, SVGPathElement[]> = {}

    try {
      const paths = element.querySelectorAll('path')

      paths.forEach((path) => {
        const segmentId = path.id
        if (!segmentId) return

        const fullId = normalizeSegment(segmentId)
        if (!pathGroups[fullId]) pathGroups[fullId] = []
        pathGroups[fullId].push(path)
      })
    } catch (error) {
      console.error('Error querying paths:', error)
    }

    return pathGroups
  }

  const applyFillStyle = (
    path: SVGPathElement,
    assigned: any[] | undefined,
    isSelected: boolean,
  ) => {
    try {
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
    } catch (error) {
      console.error('Error applying fill style:', error)
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

    try {
      path.addEventListener('click', handleClick)
      path.addEventListener('mouseenter', handleMouseEnter)
      path.addEventListener('mouseleave', handleMouseLeave)

      // Store event handlers for cleanup
      ;(path as any).__eventHandlers = {
        click: handleClick,
        mouseenter: handleMouseEnter,
        mouseleave: handleMouseLeave,
      }
    } catch (error) {
      console.error('Error attaching events:', error)
    }
  }

  const removeSegmentEvents = (path: SVGPathElement) => {
    try {
      const handlers = (path as any).__eventHandlers
      if (handlers) {
        path.removeEventListener('click', handlers.click)
        path.removeEventListener('mouseenter', handlers.mouseenter)
        path.removeEventListener('mouseleave', handlers.mouseleave)
        delete (path as any).__eventHandlers
      }
    } catch (error) {
      console.error('Error removing events:', error)
    }
  }

  const bindSvgPaths = (element: HTMLElement | SVGSVGElement) => {
    try {
      // Validate element has querySelectorAll method
      if (!element || typeof element.querySelectorAll !== 'function') {
        console.warn('useInteractiveSvg: Invalid element provided to bindSvgPaths')
        return
      }

      // Clean up previous event listeners
      const allPaths = element.querySelectorAll('path')
      allPaths.forEach(removeSegmentEvents)

      const pathGroups = groupPathsBySegment(element)

      // Check if any tooth part has an implant procedure
      const hasImplantProcedure = Object.values(assignments.value).some((assigned: any[]) =>
        assigned?.some((proc: any) => proc.behavior === 'Implant')
      )

      // Handle implant display
      if (hasImplantProcedure) {
        // Hide only root paths (keep crown visible)
        const rootPaths = element.querySelectorAll('path[id*="root"]')
        
        rootPaths.forEach((path) => {
          ;(path as HTMLElement).style.display = 'none'
        })

        // Show implant group
        const implantGroups = element.querySelectorAll('g[id*="implant"]')
        implantGroups.forEach((group) => {
          ;(group as HTMLElement).style.display = 'block'
          ;(group as HTMLElement).style.visibility = 'visible'
          ;(group as HTMLElement).style.opacity = '1'
        })

        // Style implant paths
        const implantPaths = element.querySelectorAll('g[id*="implant"] path')
        implantPaths.forEach((path) => {
          ;(path as HTMLElement).style.display = 'block'
          ;(path as HTMLElement).style.fill = '#9a9a9a'
          ;(path as HTMLElement).style.stroke = '#000000'
          ;(path as HTMLElement).style.strokeWidth = '1px'
          ;(path as HTMLElement).style.cursor = 'pointer'
        })
      } else {
        // Show root paths and hide implant group
        const rootPaths = element.querySelectorAll('path[id*="root"]')
        
        rootPaths.forEach((path) => {
          ;(path as HTMLElement).style.display = 'inline'
        })

        // Hide implant group
        const implantGroups = element.querySelectorAll('g[id*="implant"]')
        implantGroups.forEach((group) => {
          ;(group as HTMLElement).style.display = 'none'
        })
      }

      Object.entries(pathGroups).forEach(([fullId, group]) => {
        const isSelected = selectedSegments.value.includes(fullId)
        const assigned = assignments.value[fullId]

        group.forEach((path) => {
          path.setAttribute('cursor', 'pointer')
          applyFillStyle(path, assigned, isSelected)
          attachSegmentEvents(path, fullId)
        })
      })
    } catch (error) {
      console.error('Error binding SVG paths:', error)
    }
  }

  const updateSvg = async () => {
    // Wait for next tick to ensure DOM is ready
    await nextTick()

    const element = getDomElement()
    if (!element) {
      console.warn('useInteractiveSvg: No valid DOM element found')
      return
    }

    bindSvgPaths(element)
  }

  // Watch for changes and update SVG
  watch([assignments, procedureColors, selectedSegments], updateSvg, { deep: true })

  onMounted(() => {
    // Small delay to ensure component is fully rendered
    setTimeout(updateSvg, 100)
  })

  onUnmounted(() => {
    // Clean up event listeners
    const element = getDomElement()
    if (element && typeof element.querySelectorAll === 'function') {
      try {
        const allPaths = element.querySelectorAll('path')
        allPaths.forEach(removeSegmentEvents)
      } catch (error) {
        console.error('Error during cleanup:', error)
      }
    }
  })

  return {
    hoveredSegment,
    assignedProcedures,
    showTooltip,
  }
}
