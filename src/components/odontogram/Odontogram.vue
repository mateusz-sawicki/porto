<!-- components/Odontogram.vue -->
<template>
  <div class="w-full">
    <!-- Side-by-side layout: Chart LEFT, Controls RIGHT -->
    <div class="flex gap-6">
      <!-- Dental Chart on LEFT - Fixed 1490px width -->
      <div class="flex-shrink-0">
        <ScrollArea
          ref="scrollAreaRef"
          class="h-[600px]"
          style="width: 1490px"
          orientation="horizontal"
        >
          <div
            class="odontogram-content"
            :style="{
              width: `${totalContainerWidth}px`,
              minWidth: `${totalContainerWidth}px`,
              maxWidth: `${totalContainerWidth}px`,
            }"
          >
            <!-- Upper row - Q1 and Q2 with fixed center line -->
            <div
              class="flex mb-2"
              :style="{
                gap: `${quadrantGap}px`,
                marginLeft: `${upperRowLeftMargin}px`,
              }"
            >
              <Quadrant
                :teeth="q1teeth"
                :selectedSegments="selectedSegments"
                :selectedToothNumbers="selectedToothNumbers"
                :direction="ToothContainerDirection.Top"
                side="left"
                @segment-click="handleSegmentClick"
                @tooth-click="handleToothClick"
                @remove-tooth="handleRemoveTooth"
                @add-extra-tooth="handleAddExtraTooth"
              />
              <Quadrant
                :teeth="q2teeth"
                :selectedSegments="selectedSegments"
                :selectedToothNumbers="selectedToothNumbers"
                :direction="ToothContainerDirection.Top"
                side="right"
                @segment-click="handleSegmentClick"
                @tooth-click="handleToothClick"
                @remove-tooth="handleRemoveTooth"
                @add-extra-tooth="handleAddExtraTooth"
              />
            </div>

            <!-- Lower row - Q4 and Q3 with fixed center line -->
            <div
              class="flex"
              :style="{
                gap: `${quadrantGap}px`,
                marginLeft: `${lowerRowLeftMargin}px`,
              }"
            >
              <Quadrant
                :teeth="q4teeth"
                :selectedSegments="selectedSegments"
                :selectedToothNumbers="selectedToothNumbers"
                :direction="ToothContainerDirection.Bottom"
                side="left"
                @segment-click="handleSegmentClick"
                @tooth-click="handleToothClick"
                @remove-tooth="handleRemoveTooth"
                @add-extra-tooth="handleAddExtraTooth"
              />
              <Quadrant
                :teeth="q3teeth"
                :selectedSegments="selectedSegments"
                :selectedToothNumbers="selectedToothNumbers"
                :direction="ToothContainerDirection.Bottom"
                side="right"
                @segment-click="handleSegmentClick"
                @tooth-click="handleToothClick"
                @remove-tooth="handleRemoveTooth"
                @add-extra-tooth="handleAddExtraTooth"
              />
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <!-- Controls on RIGHT -->
      <div class="flex-1 min-w-0">
        <OdontogramControls
          :selectedProcedure="selectedProcedure"
          :palette="procedurePalette"
          :targetMap="procedureTargetMap"
          :search="search"
          :isProcedureMissing="isProcedureMissing"
          @select="handleProcedureSelect"
          @clear="setSelectedProcedure(null)"
          @search-change="setSearch"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick, watch, inject } from 'vue'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { ToothContainerDirection } from '@/types/odontogram/odontogram'
import OdontogramControls from '@/components/odontogram/OdontogramControls.vue'
import Quadrant from '@/components/odontogram/Quadrant.vue'
import type { useOdontogram } from '@/composables/odontogram/useOdontogram'

const odontogram = inject<ReturnType<typeof useOdontogram>>('odontogram')
if (!odontogram) throw new Error('Odontogram composable not provided!')

const {
  selectedProcedure,
  search,
  selectedSegments,
  selectedToothNumbers,
  teeth,
  isProcedureMissing,
  q1teeth,
  q2teeth,
  q3teeth,
  q4teeth,
  procedureTargetMap,
  procedurePalette,
  handleSegmentClick,
  handleToothClick,
  handleRemoveTooth,
  handleAddExtraTooth,
  handleProcedureSelect,
  setSelectedProcedure,
  setSearch,
} = odontogram

// Constants
const TOOTH_WIDTH = 90
const quadrantGap = 10
const paperPadding = 20

// ScrollArea reference
const scrollAreaRef = ref<InstanceType<typeof ScrollArea> | null>(null)

// Calculate widths for each quadrant
const q1Width = computed(() => q1teeth.value.length * TOOTH_WIDTH)
const q2Width = computed(() => q2teeth.value.length * TOOTH_WIDTH)
const q3Width = computed(() => q3teeth.value.length * TOOTH_WIDTH)
const q4Width = computed(() => q4teeth.value.length * TOOTH_WIDTH)

/*
 * ALIGNED QUADRANT APPROACH:
 * - Left quadrants (Q1, Q4) use same width (max of both)
 * - Right quadrants (Q2, Q3) use same width (max of both)
 * - This keeps the center gap perfectly aligned between upper and lower rows
 * - Q1 and Q4 are right-aligned within their allocated space
 * - Q2 and Q3 are left-aligned within their allocated space
 */

// Calculate aligned widths to keep center gaps aligned
const leftQuadrantWidth = computed(() => Math.max(q1Width.value, q4Width.value))
const rightQuadrantWidth = computed(() => Math.max(q2Width.value, q3Width.value))

// Calculate total container width with aligned quadrants
const totalContainerWidth = computed(() => {
  return (
    paperPadding + leftQuadrantWidth.value + quadrantGap + rightQuadrantWidth.value + paperPadding
  )
})

// Position quadrants to maintain center alignment
const upperRowLeftMargin = computed(() => {
  // Q1 should be right-aligned within the left quadrant space
  return paperPadding + (leftQuadrantWidth.value - q1Width.value)
})

const lowerRowLeftMargin = computed(() => {
  // Q4 should be right-aligned within the left quadrant space
  return paperPadding + (leftQuadrantWidth.value - q4Width.value)
})

// Get the actual scrolling viewport from ScrollArea
const getScrollContainer = () => {
  if (scrollAreaRef.value?.$el) {
    return scrollAreaRef.value.$el.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement
  }
  return null
}

// Center the odontogram content
const centerOdontogram = () => {
  const container = getScrollContainer()
  if (container) {
    // Center based on the actual content width
    const contentCenter = totalContainerWidth.value / 2
    const viewportCenter = container.clientWidth / 2
    const scrollToPosition = contentCenter - viewportCenter

    container.scrollTo({
      left: Math.max(0, scrollToPosition),
      behavior: 'smooth',
    })
  }
}

// Keyboard shortcuts
const handleKeyDown = (e: KeyboardEvent) => {
  const container = getScrollContainer()
  if (!container) return

  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault()
      container.scrollBy({ left: -200, behavior: 'smooth' })
      break
    case 'ArrowRight':
      e.preventDefault()
      container.scrollBy({ left: 200, behavior: 'smooth' })
      break
    case 'Home':
      e.preventDefault()
      container.scrollTo({ left: 0, behavior: 'smooth' })
      break
    case 'End':
      e.preventDefault()
      container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' })
      break
    case ' ':
      e.preventDefault()
      centerOdontogram()
      break
  }
}

// Auto-center when teeth change
watch(
  [teeth, totalContainerWidth],
  async () => {
    await nextTick()
    setTimeout(() => {
      centerOdontogram()
    }, 200)
  },
  { deep: true },
)

// Debug logging (remove in production)
watch(
  [q1Width, q2Width, q3Width, q4Width, leftQuadrantWidth, rightQuadrantWidth, totalContainerWidth],
  ([q1W, q2W, q3W, q4W, leftW, rightW, containerWidth]) => {
    console.log('Odontogram Layout Debug:', {
      q1Width: q1W,
      q2Width: q2W,
      q3Width: q3W,
      q4Width: q4W,
      leftQuadrantWidth: leftW,
      rightQuadrantWidth: rightW,
      totalContainerWidth: containerWidth,
      upperRowLeftMargin: upperRowLeftMargin.value,
      lowerRowLeftMargin: lowerRowLeftMargin.value,
    })
  },
  { immediate: true },
)

// Auto-center on mount
onMounted(() => {
  setTimeout(() => {
    centerOdontogram()
  }, 400)

  // Add keyboard event listener
  window.addEventListener('keydown', handleKeyDown)
})

// Cleanup keyboard listener
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.odontogram-content {
  display: block;
  border-radius: 8px;
  /* Prevent content from shrinking */
  flex-shrink: 0;
  white-space: nowrap;
  /* Ensure proper sizing */
  box-sizing: border-box;
}

/* Focus indicators for accessibility */
.odontogram-content:focus {
  outline: 2px solid #3b82f6;
  outline-offset: -2px;
}

/* ScrollArea viewport styling */
:deep([data-radix-scroll-area-viewport]) {
  scroll-behavior: smooth;
}
</style>
