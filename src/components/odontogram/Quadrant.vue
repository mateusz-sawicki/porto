<!-- components/Quadrant.vue -->
<template>
  <div class="quadrant-container">
    <div v-for="tooth in sortedTeeth" :key="tooth.number" class="tooth-slot">
      <ToothContainer
        :tooth="tooth"
        :isSelected="isToothSelected(tooth.number)"
        :selectedSegments="selectedSegments"
        :direction="direction"
        @tooth-click="() => $emit('tooth-click', tooth.number)"
        @segment-click="$emit('segment-click', $event)"
        @remove-tooth="$emit('remove-tooth', $event)"
        @add-extra-tooth="$emit('add-extra-tooth', $event.base, $event.direction)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type {
  ToothData,
  ToothContainerDirection,
  ExtraToothDirection,
} from '@/types/odontogram/odontogram'
import ToothContainer from '@/components/odontogram/ToothContainer.vue'

interface Props {
  teeth: ToothData[]
  selectedSegments: string[]
  selectedToothNumbers: string[]
  direction: ToothContainerDirection
  side: 'left' | 'right'
}

interface Emits {
  (e: 'segment-click', segmentId: string): void
  (e: 'tooth-click', toothNumber: string): void
  (e: 'remove-tooth', toothNumber: string): void
  (e: 'add-extra-tooth', base: string, direction: ExtraToothDirection): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const TOOTH_WIDTH = 90

const isToothSelected = (toothNumber: string) => {
  return (
    props.selectedToothNumbers.includes(toothNumber) ||
    props.selectedSegments.some((s) => s.startsWith(toothNumber + '_'))
  )
}

// Sort teeth to ensure proper order (exact same logic as React version)
const sortedTeeth = computed(() => {
  return [...props.teeth].sort((a, b) => {
    // Extract base number and suffix for proper sorting
    const getToothInfo = (toothNumber: string) => {
      const parts = toothNumber.split(/([+-])/)
      const baseNumber = parseInt(parts[0])
      const sign = parts[1] || ''
      const suffix = parts[2] || ''
      return { baseNumber, sign, suffix, original: toothNumber }
    }

    const aInfo = getToothInfo(a.number)
    const bInfo = getToothInfo(b.number)

    // First sort by base number
    if (aInfo.baseNumber !== bInfo.baseNumber) {
      // For left side quadrants (Q1, Q4), sort descending (away from center)
      // For right side quadrants (Q2, Q3), sort ascending (away from center)
      return props.side === 'left'
        ? bInfo.baseNumber - aInfo.baseNumber
        : aInfo.baseNumber - bInfo.baseNumber
    }

    // If base numbers are the same, handle extra teeth positioning
    if (aInfo.sign !== bInfo.sign || aInfo.suffix !== bInfo.suffix) {
      // No suffix = main tooth (should be in middle position)
      if (!aInfo.sign && bInfo.sign) return 0 // Main tooth stays in place
      if (aInfo.sign && !bInfo.sign) return 0 // Main tooth stays in place

      // For left side quadrants (Q1, Q4): -1 goes towards center (right), +1 goes away (left)
      // For right side quadrants (Q2, Q3): -1 goes towards center (left), +1 goes away (right)
      if (props.side === 'left') {
        // -1 should come after the main tooth (closer to center)
        // +1 should come before the main tooth (away from center)
        if (aInfo.sign === '-' && bInfo.sign === '+') return 1
        if (aInfo.sign === '+' && bInfo.sign === '-') return -1
        if (aInfo.sign === '-') return 1
        if (aInfo.sign === '+') return -1
      } else {
        // For right side: -1 should come before the main tooth (closer to center)
        // +1 should come after the main tooth (away from center)
        if (aInfo.sign === '-' && bInfo.sign === '+') return -1
        if (aInfo.sign === '+' && bInfo.sign === '-') return 1
        if (aInfo.sign === '-') return -1
        if (aInfo.sign === '+') return 1
      }

      // If same sign, sort by suffix number
      return parseInt(aInfo.suffix || '0') - parseInt(bInfo.suffix || '0')
    }

    return 0
  })
})
</script>

<style scoped>
.quadrant-container {
  display: flex;
  gap: 0;
  overflow: visible;
}

.tooth-slot {
  width: 90px; /* TOOTH_WIDTH */
  flex: 0 0 auto;
  position: relative;
}
</style>
