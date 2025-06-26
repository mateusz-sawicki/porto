<!-- components/GumOverlay.vue -->
<template>
  <div class="absolute pointer-events-none" :style="containerStyle">
    <svg :viewBox="`0 0 ${width} ${height}`" :width="width" :height="height">
      <path :d="path" fill="hotpink" stroke-width="1" :transform="transform" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ToothContainerDirection } from '@/types/odontogram/odontogram'

interface Props {
  direction: ToothContainerDirection
  width?: number
  height?: number
  hasCutout?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: 88,
  height: 85,
  hasCutout: false,
})

const transform = computed(() =>
  props.direction === ToothContainerDirection.Bottom
    ? `rotate(180, ${props.width / 2}, ${props.height / 2})`
    : undefined,
)

const path = computed(() => {
  if (props.hasCutout) {
    const cutoutWidth = 60
    const cutoutDepth = 30
    const armLength = 10

    const left = (props.width - cutoutWidth) / 2
    const right = (props.width + cutoutWidth) / 2
    const bottom = props.height

    return `
        M0,0
        H${props.width}
        V${bottom}
        H${right + armLength}
        C ${right},${bottom} ${right},${bottom - cutoutDepth} ${props.width / 2},${bottom - cutoutDepth}
        C ${left},${bottom - cutoutDepth} ${left},${bottom} ${left - armLength},${bottom}
        H0
        Z
      `
  } else {
    return `
        M0,0
        H${props.width}
        V${props.height}
        H0
        Z
      `
  }
})

const containerStyle = computed(() => {
  const base = {
    width: `${props.width}px`,
    height: `${props.height}px`,
  }

  if (props.direction === ToothContainerDirection.Top) {
    return { ...base, top: `${props.height / 3}px` }
  } else {
    return { ...base, bottom: `${props.height / 3}px` }
  }
})
</script>
