<template>
  <div
    class="procedure-item"
    :class="{
      selected: isSelected,
      'hover:bg-accent': !isSelected,
    }"
    @click="handleClick"
  >
    <div class="flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors">
      <!-- Visual Representation -->
      <div class="flex-shrink-0">
        <div
          v-if="procedure.visual.visualType === 'Color'"
          class="w-6 h-6 rounded-sm border border-border"
          :style="{ backgroundColor: procedure.visual.value }"
        />
        <ProcedureIcon
          v-else-if="procedure.visual.visualType === 'Icon'"
          :icon-name="procedure.visual.value"
          :icon-source="procedure.visual.iconSource"
          class="w-6 h-6"
        />
      </div>

      <!-- Procedure Info -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <h4 class="font-medium text-sm truncate">{{ procedure.name }}</h4>
          <div class="flex items-center gap-1">
            <!-- Category Badge -->
            <Badge v-if="procedure.category" variant="outline" class="text-xs">
              {{ procedure.category }}
            </Badge>

            <!-- Selection Indicator -->
            <Check v-if="isSelected" class="h-4 w-4 text-primary" />
          </div>
        </div>

        <!-- Description -->
        <p v-if="procedure.description" class="text-xs text-muted-foreground truncate mt-1">
          {{ procedure.description }}
        </p>

        <!-- Targets -->
        <div class="flex flex-wrap gap-1 mt-2">
          <Badge
            v-for="target in availableTargets"
            :key="target"
            variant="secondary"
            class="text-xs"
          >
            {{ target }}
          </Badge>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import type { ProcedureWithTarget } from '@/services/procedure/procedureApi'
import ProcedureIcon from './ProcedureIcon.vue'

interface Props {
  procedure: ProcedureWithTarget
  isSelected: boolean
  availableTargets: string[]
}

interface Emits {
  (e: 'select', procedure: ProcedureWithTarget): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleClick = () => {
  emit('select', props.procedure)
}
</script>

<style scoped>
.procedure-item {
  border: 1px solid transparent;
}

.procedure-item.selected {
  border-color: hsl(var(--primary));
  background-color: hsl(var(--primary) / 0.05);
}

.procedure-item:hover {
  border-color: hsl(var(--border));
}
</style>
