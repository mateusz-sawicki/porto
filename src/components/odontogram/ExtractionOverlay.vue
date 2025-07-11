<!-- components/ExtractionOverlay.vue -->
<template>
  <div class="absolute pointer-events-none" :class="overlayPositionClass" style="z-index: 20">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 90 240"
      xmlns="http://www.w3.org/2000/svg"
      class="w-full h-full"
      preserveAspectRatio="none"
    >
      <!-- First diagonal line (top-left to bottom-right) -->
      <line
        x1="10"
        y1="10"
        x2="80"
        y2="230"
        stroke="#ef4444"
        stroke-width="3"
        stroke-linecap="round"
      />
      <!-- Second diagonal line (top-right to bottom-left) -->
      <line
        x1="80"
        y1="10"
        x2="10"
        y2="230"
        stroke="#ef4444"
        stroke-width="3"
        stroke-linecap="round"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ToothContainerDirection } from '@/types/odontogram/odontogram'

interface Props {
  direction: ToothContainerDirection
}

const props = defineProps<Props>()

// Position overlay to avoid label area
const overlayPositionClass = computed(() => {
  if (props.direction === ToothContainerDirection.Top) {
    // For top direction: label is at top, so overlay starts after label (around 30px) and goes to bottom
    return 'top-7 left-0 right-0 bottom-2'
  } else {
    // For bottom direction: label is at bottom, so overlay starts from top and ends before label (around 30px)
    return 'top-2 left-0 right-0 bottom-7'
  }
})
</script>
