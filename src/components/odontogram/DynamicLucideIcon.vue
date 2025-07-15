<script setup lang="ts">
import * as LucideIcons from 'lucide-vue-next'
import { computed } from 'vue'

interface Props {
  icon: string
  class?: string
}

const props = defineProps<Props>()

const IconComp = computed(() => {
  const IconComponent = (LucideIcons as any)[props.icon]
  return IconComponent
})

const shouldRenderText = computed(() => {
  // Render as text only if icon is not found in Lucide and is a single non-alphanumeric character
  return !IconComp.value && props.icon.length === 1 && !/^[a-z0-9]$/i.test(props.icon)
})
</script>

<template>
  <component
    v-if="IconComp"
    :is="IconComp"
    v-bind="$attrs"
    :class="props.class"
  />
  <span
    v-else-if="shouldRenderText"
    :class="props.class"
    style="display: inline-flex; align-items: center; justify-content: center; font-size: 1.25rem; color: #2563eb; opacity: 0.8; font-weight: bold; width: 1.25em; height: 1.25em;"
  >
    {{ icon }}
  </span>
</template>
