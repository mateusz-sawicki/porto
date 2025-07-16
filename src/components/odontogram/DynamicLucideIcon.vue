<script setup lang="ts">
import * as LucideIcons from 'lucide-vue-next'
import { computed } from 'vue'

interface Props {
  icon: string
  class?: string
  fill?: string
}

const props = defineProps<Props>()

const IconComp = computed(() => {
  const IconComponent = (LucideIcons as any)[props.icon]
  return IconComponent
})
</script>

<template>
  <component :is="IconComp" v-bind="$attrs" :class="props.class" :fill="fill" />
</template>
