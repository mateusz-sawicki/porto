<script setup lang="ts">
import { IconTilde } from '@tabler/icons-vue'
interface Props {
  iconName: string
}

const props = defineProps<Props>()
</script>

<template>
  <IconTilde v-if="props.iconName == 'IconTilde'" />
</template>
