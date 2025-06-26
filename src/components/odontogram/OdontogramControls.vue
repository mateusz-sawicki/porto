<!-- components/OdontogramControls.vue -->
<template>
  <div class="relative w-full">
    <div class="relative flex items-center">
      <div
        v-if="selectedProcedure?.visual.visualType === 'Color'"
        class="absolute left-3 z-10 w-3 h-3 rounded-sm"
        :style="{ backgroundColor: selectedProcedure.visual.value }"
      />

      <Input
        v-model="inputValue"
        @input="handleInput"
        @focus="isOpen = true"
        placeholder="Wybierz procedurę"
        :class="
          cn(
            'w-full',
            selectedProcedure?.visual.visualType === 'Color' && 'pl-8',
            isProcedureMissing && 'border-red-500 animate-pulse',
          )
        "
      />

      <div class="absolute right-3 flex items-center">
        <Button
          v-if="selectedProcedure"
          variant="ghost"
          size="sm"
          @click.stop="handleClear"
          class="h-auto p-1 hover:bg-transparent"
        >
          <X class="h-4 w-4 text-gray-500" />
        </Button>
        <Search v-else class="h-4 w-4 text-gray-500" />
      </div>
    </div>

    <!-- Dropdown -->
    <div
      v-if="isOpen && filteredProcedures.length > 0"
      class="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border rounded-md shadow-md max-h-48 overflow-y-auto"
    >
      <div
        v-for="procedure in filteredProcedures"
        :key="procedure.name"
        @click="() => handleProcedureSelect(procedure)"
        class="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground"
      >
        <div class="flex items-center gap-2">
          <div
            v-if="procedure.visual.visualType === 'Color'"
            class="w-3 h-3 rounded-sm"
            :style="{ backgroundColor: procedure.visual.value }"
          />
          <span>{{ procedure.name }}</span>
        </div>
        <span class="text-xs text-muted-foreground whitespace-nowrap ml-4">
          [{{ getTargetText(procedure.name) }}]
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Search, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Procedure } from '@/types/odontogram/odontogram'

interface Props {
  selectedProcedure: Procedure | null
  palette: Procedure[]
  targetMap: Record<string, string | string[]>
  search: string
  isProcedureMissing: boolean
}

interface Emits {
  (e: 'select', procedure: Procedure): void
  (e: 'clear'): void
  (e: 'search-change', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isOpen = ref(false)
const inputValue = ref('')

const filteredProcedures = computed(() => {
  if (!inputValue.value) return props.palette
  return props.palette.filter((procedure) =>
    procedure.name.toLowerCase().includes(inputValue.value.toLowerCase()),
  )
})

const getTargetText = (procedureName: string) => {
  const target = props.targetMap[procedureName]
  return Array.isArray(target) ? target.join(', ') : target
}

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  inputValue.value = value
  emit('search-change', value)
  isOpen.value = true
}

const handleProcedureSelect = (procedure: Procedure) => {
  emit('select', procedure)
  emit('search-change', '')
  inputValue.value = ''
  isOpen.value = false
}

const handleClear = () => {
  emit('clear')
  inputValue.value = ''
  emit('search-change', '')
}

const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.relative')) {
    isOpen.value = false
  }
}

// Update input value when selected procedure changes
watch(
  () => props.selectedProcedure,
  (newProcedure) => {
    if (newProcedure) {
      inputValue.value = newProcedure.name
    }
  },
)

// Update input value when search changes externally
watch(
  () => props.search,
  (newSearch) => {
    if (newSearch !== inputValue.value) {
      inputValue.value = newSearch
    }
  },
)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
