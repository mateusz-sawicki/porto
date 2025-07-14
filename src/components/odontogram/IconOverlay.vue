<!-- components/IconOverlay.vue -->
<template>
  <div class="absolute pointer-events-none" :class="overlayPositionClass" style="z-index: 20">
    <div class="flex items-center justify-center w-full h-full">
      <slot>
        <div class="text-sm text-blue-600 font-bold opacity-80">{{ icon }}</div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ToothContainerDirection } from '@/types/odontogram/odontogram'

interface Props {
  direction: ToothContainerDirection
  position: 'tooth' | 'crown' | 'root' | 'schematic'
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: '👁',
})

// Position overlay based on the part and direction
const overlayPositionClass = computed(() => {
  if (props.position === 'tooth') {
    // For tooth-level: between tooth and schematic (in the gap)
    if (props.direction === ToothContainerDirection.Top) {
      return 'top-[160px] left-0 right-0 h-6'
    } else {
      return 'bottom-[160px] left-0 right-0 h-6'
    }
  } else if (props.position === 'crown') {
    if (props.direction === ToothContainerDirection.Top) {
      return 'top-[30px] left-0 right-0 h-8'
    } else {
      return 'bottom-[30px] left-0 right-0 h-8'
    }
  } else if (props.position === 'root') {
    if (props.direction === ToothContainerDirection.Top) {
      return 'top-[80px] left-0 right-0 h-8'
    } else {
      return 'bottom-[80px] left-0 right-0 h-8'
    }
  } else if (props.position === 'schematic') {
    if (props.direction === ToothContainerDirection.Top) {
      return 'top-[200px] left-0 right-0 h-6'
    } else {
      return 'bottom-[200px] left-0 right-0 h-6'
    }
  }
  return 'top-7 left-0 right-0 bottom-2'
})
</script>
