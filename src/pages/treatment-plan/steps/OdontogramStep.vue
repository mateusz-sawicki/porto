<template>
  <div class="space-y-6">
    <!-- Odontogram Component (chart + controls) -->
    <Odontogram />

    <!-- Procedures Summary -->
    <ToothProceduresSummary
      :teeth-with-procedures="teethWithProcedures"
      @remove-procedure="handleRemoveProcedure"
    />
  </div>
</template>

<script setup lang="ts">
import Odontogram from '@/components/odontogram/Odontogram.vue'
import ToothProceduresSummary from '@/components/odontogram/ToothProcedureSummary.vue'

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