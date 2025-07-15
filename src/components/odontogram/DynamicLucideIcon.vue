<script setup lang="ts">
import * as LucideIcons from 'lucide-vue-next'
import { computed } from 'vue'

interface Props {
  icon: string
  class?: string
}

const props = defineProps<Props>()

const IconComp = computed(() => {
  const IconComponent = (LucideIcons as any)[props.icon] || LucideIcons.Eye
  return IconComponent
})
</script>

<template>
  <component :is="IconComp" v-bind="$attrs" :class="props.class" />
</template>
