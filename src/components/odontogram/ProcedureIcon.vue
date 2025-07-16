<template>
  <div>
    <DynamicLucideIcon
      v-if="props.iconSource === ProcedureIconSource.Lucide"
      :icon="props.iconName"
      :class="props.class"
      :fill="props.fill"
    />
    <TablerIcon
      v-else-if="props.iconSource === ProcedureIconSource.Tabler"
      :icon-name="props.iconName"
    />
    <!-- Fallback for when iconSource is undefined or not recognized -->
    <div v-else class="flex items-center justify-center" :class="props.class">
      <span class="text-xs font-bold">{{ props.iconName }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProcedureIconSource } from '@/types/odontogram/odontogram'
import DynamicLucideIcon from './DynamicLucideIcon.vue'
import TablerIcon from './TablerIcon.vue'

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
