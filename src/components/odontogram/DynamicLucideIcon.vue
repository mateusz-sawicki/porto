<script setup lang="ts">
import * as LucideIcons from 'lucide-vue-next'
import { computed } from 'vue'

interface Props {
  icon: string
  class?: string
}

const props = defineProps<Props>()

// Explicitly type the icon component to avoid TypeScript inference issues
const IconComp = computed(() => {
  const IconComponent = (LucideIcons as any)[props.icon] || LucideIcons.Eye
  return IconComponent
})
</script>

<template>
  <IconComp v-bind="$attrs" :class="props.class" />
</template>
