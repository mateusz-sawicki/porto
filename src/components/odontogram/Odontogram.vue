<!-- components/Odontogram.vue -->
<template>
  <div class="w-full">
    <!-- Controls -->
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

    <!-- Dental Chart with ScrollArea - FIXED VIEWPORT WIDTH -->
    <ScrollArea
      ref="scrollAreaRef"
      :class="`h-[600px] mx-auto`"
      :style="{ width: `${BASE_VIEWPORT_WIDTH}px`, maxWidth: '100%' }"
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
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useOdontogram } from '@/composables/odontogram/useOdontogram'
import { ToothContainerDirection } from '@/types/odontogram/odontogram'
import OdontogramControls from '@/components/odontogram/OdontogramControls.vue'
import Quadrant from '@/components/odontogram/Quadrant.vue'

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
} = useOdontogram()

// Constants
const TOOTH_WIDTH = 90
const quadrantGap = 10
const paperPadding = 20

// Calculate initial/base viewport width (for standard tooth configuration)
const STANDARD_TEETH_PER_QUADRANT = 8 // Standard adult teeth per quadrant
const BASE_VIEWPORT_WIDTH =
  STANDARD_TEETH_PER_QUADRANT * TOOTH_WIDTH * 2 + quadrantGap + paperPadding * 2

// ScrollArea reference
const scrollAreaRef = ref<InstanceType<typeof ScrollArea> | null>(null)

// Calculate widths for each quadrant
const q1Width = computed(() => q1teeth.value.length * TOOTH_WIDTH)
const q2Width = computed(() => q2teeth.value.length * TOOTH_WIDTH)
const q3Width = computed(() => q3teeth.value.length * TOOTH_WIDTH)
const q4Width = computed(() => q4teeth.value.length * TOOTH_WIDTH)

/*
 * DYNAMIC CENTER LINE APPROACH WITH STABILITY:
 * - Center line position adapts to ensure all teeth fit within container bounds
 * - Prioritizes minimal movement when teeth are added
 * - Container grows appropriately to accommodate all teeth
 * - All quadrants remain properly positioned relative to center line
 */

// Base center line position (preferred position when possible)
const BASE_CENTER_LINE = 1000

// Calculate how much space each side needs from the center line
const leftSideNeeded = computed(() => Math.max(q1Width.value, q4Width.value) + quadrantGap / 2)
const rightSideNeeded = computed(() => Math.max(q2Width.value, q3Width.value) + quadrantGap / 2)

// Calculate actual center line position (may shift if needed for extreme expansions)
const actualCenterLine = computed(() => {
  // Minimum position needed to fit left side teeth
  const minCenterForLeftSide = leftSideNeeded.value + paperPadding

  // Use base position if it accommodates left side, otherwise shift right as needed
  return Math.max(BASE_CENTER_LINE, minCenterForLeftSide)
})

// Calculate total container width needed
const totalContainerWidth = computed(() => {
  return actualCenterLine.value + rightSideNeeded.value + paperPadding
})

// Position quadrants relative to the actual center line
const upperRowLeftMargin = computed(() => {
  // Position Q1 so its right edge aligns with (actualCenterLine - gap/2)
  return actualCenterLine.value - q1Width.value - quadrantGap / 2
})

const lowerRowLeftMargin = computed(() => {
  // Position Q4 so its right edge aligns with (actualCenterLine - gap/2)
  return actualCenterLine.value - q4Width.value - quadrantGap / 2
})

// Get the actual scrolling viewport from ScrollArea
const getScrollContainer = () => {
  if (scrollAreaRef.value?.$el) {
    return scrollAreaRef.value.$el.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement
  }
  return null
}

// Center the odontogram on the actual center line
const centerOdontogram = () => {
  const container = getScrollContainer()
  if (container) {
    // The actual center line position within the total container (including padding)
    const absoluteCenterPosition = paperPadding + actualCenterLine.value
    const viewportCenter = container.clientWidth / 2
    const scrollToPosition = absoluteCenterPosition - viewportCenter

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
  [teeth, totalContainerWidth, actualCenterLine],
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
  [actualCenterLine, leftSideNeeded, rightSideNeeded, totalContainerWidth],
  ([centerLine, leftNeeded, rightNeeded, containerWidth]) => {
    console.log('Odontogram Layout Debug:', {
      actualCenterLine: centerLine,
      leftSideNeeded: leftNeeded,
      rightSideNeeded: rightNeeded,
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
