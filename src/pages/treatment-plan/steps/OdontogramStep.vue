<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 gap-6">
      <!-- Odontogram Component (chart + controls) -->
      <Odontogram :isPediatric="props.isPediatric" @pin-change="handlePinChange" />

      <!-- Procedures Summary -->
      <div
        class="transition-all duration-300 ease-in-out"
        :class="{ 'h-120 overflow-y-auto border rounded-lg p-4 bg-muted/30': isOdontogramPinned }"
      >
        <ToothProceduresSummary
          :teeth-with-procedures="teethWithProcedures"
          :is-odontogram-pinned="isOdontogramPinned"
          @remove-procedure="handleRemoveProcedure"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Odontogram from '@/components/odontogram/Odontogram.vue'
import ToothProceduresSummary from '@/components/odontogram/ToothProcedureSummary.vue'

// Pin state management
const isOdontogramPinned = ref(false)

const handlePinChange = (isPinned: boolean) => {
  isOdontogramPinned.value = isPinned
}

interface Procedure {
  name: string
  description?: string
  visual: {
    visualType: 'Color' | 'Pattern' | 'Icon' | 'GumShape' | 'ToothShape'
    value: string
  }
}

interface ToothWithProcedures {
  toothNumber: string
  procedures: Procedure[]
}

interface Props {
  teethWithProcedures: ToothWithProcedures[]
  isPediatric?: boolean
}

interface Emits {
  (e: 'remove-procedure', toothNumber: string, procedure: Procedure): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleRemoveProcedure = (toothNumber: string, procedure: Procedure) => {
  emit('remove-procedure', toothNumber, procedure)
}
</script>
