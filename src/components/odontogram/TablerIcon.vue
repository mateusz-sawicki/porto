<script setup lang="ts">
import { IconTilde } from '@tabler/icons-vue'
interface Props {
  iconName: string
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <IconTilde v-if="props.iconName == 'IconTilde'" :class="props.class" />
</template>
