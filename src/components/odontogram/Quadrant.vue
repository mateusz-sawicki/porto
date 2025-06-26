<!-- components/Quadrant.vue -->
<template>
  <div class="flex">
    <div v-for="tooth in sortedTeeth" :key="tooth.number" class="w-[90px] flex-shrink-0 relative">
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

const isToothSelected = (toothNumber: string) => {
  return (
    props.selectedToothNumbers.includes(toothNumber) ||
    props.selectedSegments.some((s) => s.startsWith(toothNumber + '_'))
  )
}

const sortedTeeth = computed(() => {
  return [...props.teeth].sort((a, b) => {
    const getToothInfo = (toothNumber: string) => {
      const parts = toothNumber.split(/([+-])/)
      const baseNumber = parseInt(parts[0])
      const sign = parts[1] || ''
      const suffix = parts[2] || ''
      return { baseNumber, sign, suffix }
    }

    const aInfo = getToothInfo(a.number)
    const bInfo = getToothInfo(b.number)

    if (aInfo.baseNumber !== bInfo.baseNumber) {
      return props.side === 'left'
        ? bInfo.baseNumber - aInfo.baseNumber
        : aInfo.baseNumber - bInfo.baseNumber
    }

    if (aInfo.sign !== bInfo.sign || aInfo.suffix !== bInfo.suffix) {
      if (!aInfo.sign && bInfo.sign) return 0
      if (aInfo.sign && !bInfo.sign) return 0

      if (props.side === 'left') {
        if (aInfo.sign === '-' && bInfo.sign === '+') return 1
        if (aInfo.sign === '+' && bInfo.sign === '-') return -1
        if (aInfo.sign === '-') return 1
        if (aInfo.sign === '+') return -1
      } else {
        if (aInfo.sign === '-' && bInfo.sign === '+') return -1
        if (aInfo.sign === '+' && bInfo.sign === '-') return 1
        if (aInfo.sign === '-') return -1
        if (aInfo.sign === '+') return 1
      }

      return parseInt(aInfo.suffix || '0') - parseInt(bInfo.suffix || '0')
    }

    return 0
  })
})
</script>
