<template>
  <div>
    <!-- Use IconifyIcon for dynamic API-driven icons -->
    <IconifyIcon
      v-if="props.iconSource && props.iconName"
      :icon-name="props.iconName"
      :icon-source="props.iconSource"
      :class="props.class"
    />
    <!-- Fallback for when iconSource is undefined or not recognized -->
    <div v-else class="flex items-center justify-center" :class="props.class">
      <span
        class="text-xs font-bold"
        :title="`iconSource: ${props.iconSource}, iconName: ${props.iconName}`"
        >{{ props.iconName }}</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProcedureIconSource } from '@/types/odontogram/odontogram'
import IconifyIcon from './IconifyIcon.vue'

const props = withDefaults(
  defineProps<{
    iconName: string
    class?: string
    fill?: string
    iconSource?: ProcedureIconSource
  }>(),
  {
    class: 'w-6 h-6 flex-shrink-0 text-blue-600 opacity-80',
    fill: undefined,
    iconSource: undefined,
  },
)
</script>
