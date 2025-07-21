<!-- components/Quadrant.vue -->
<template>
  <div class="quadrant-container">
    <div v-for="tooth in sortedTeeth" :key="tooth.number" class="tooth-slot">
      <ToothContainer
        :tooth="tooth"
        :isSelected="isToothSelected(tooth.number)"
        :selectedSegments="selectedSegments"
        :direction="direction"
        :isPediatric="props.isPediatric"
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
  isPediatric?: boolean
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

// Helper function to get tooth position with fallback
const getToothPosition = (tooth: ToothData): number => {
  if (tooth.position !== undefined) {
    return tooth.position
  }
  
  // Fallback: calculate position from tooth number
  const baseNumber = tooth.number.replace(/[+-]\d+$/, '')
  const lastDigit = baseNumber[1]
  
  switch(lastDigit) {
    case '1': return 1 // Central incisors
    case '2': return 2 // Lateral incisors  
    case '3': return 3 // Canines
    case '4': return 4 // First premolar/primary molar
    case '5': return 5 // Second premolar/primary molar
    case '6': return 6 // First permanent molar
    case '7': return 7 // Second permanent molar
    case '8': return 8 // Third permanent molar
    default: return 999 // Unknown
  }
}

// Sort teeth by their position property (1-8) and handle extra teeth
const sortedTeeth = computed(() => {
  return [...props.teeth].sort((a, b) => {
    // Get positions with fallback for backward compatibility
    const aPosition = getToothPosition(a)
    const bPosition = getToothPosition(b)
    
    // First sort by anatomical position
    if (aPosition !== bPosition) {
      // For left side quadrants (Q1, Q4), sort descending (away from center: 8,7,6,5,4,3,2,1)
      // For right side quadrants (Q2, Q3), sort ascending (away from center: 1,2,3,4,5,6,7,8)
      return props.side === 'left' ? bPosition - aPosition : aPosition - bPosition
    }

    // If same position (extra teeth), handle +/- suffix sorting
    const getToothInfo = (toothNumber: string) => {
      const parts = toothNumber.split(/([+-])/)
      const baseNumber = parts[0]
      const sign = parts[1] || ''
      const suffix = parts[2] || ''
      return { baseNumber, sign, suffix }
    }

    const aInfo = getToothInfo(a.number)
    const bInfo = getToothInfo(b.number)

    // Handle extra teeth positioning
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
