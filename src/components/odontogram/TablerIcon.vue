<script setup lang="ts">
import { IconTilde } from '@tabler/icons-vue'
interface Props {
  iconName: string
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <IconTilde v-if="props.iconName === 'IconTilde'" :class="props.class" />
  <!-- Fallback for unsupported Tabler icons -->
  <div v-else class="flex items-center justify-center" :class="props.class">
    <span class="text-xs font-bold">{{ props.iconName }}</span>
  </div>
</template>
