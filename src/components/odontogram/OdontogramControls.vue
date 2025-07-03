<!-- components/OdontogramControls.vue -->
<template>
  <div class="w-full space-y-4">
    <!-- Procedure Selection -->
    <div ref="containerRef" class="relative w-full">
      <div
        v-if="selectedProcedure?.visual.visualType === 'Color'"
        class="absolute left-3 top-1/2 z-10 w-3 h-3 rounded-sm transform -translate-y-1/2"
        :style="{ backgroundColor: selectedProcedure.visual.value }"
      />

      <Input
        v-model="searchValue"
        @input="handleSearchChange"
        @focus="isOpen = true"
        @keydown="handleKeyDown"
        placeholder="Wybierz procedurę"
        :class="
          cn(
            'w-full',
            selectedProcedure?.visual.visualType === 'Color' && 'pl-8',
            isProcedureMissing && 'border-red-500 animate-pulse',
          )
        "
      />

      <div class="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
        <!-- Clear button - show when there's text in input OR a procedure is selected -->
        <Button
          v-if="searchValue || selectedProcedure"
          variant="ghost"
          size="sm"
          @click.stop="handleClearInput"
          class="h-auto p-1 hover:bg-transparent"
        >
          <X class="h-4 w-4 text-gray-500" />
        </Button>
        <ChevronDown v-else class="h-4 w-4 text-gray-500" />
      </div>

      <!-- Dropdown -->
      <div
        v-if="isOpen && filteredProcedures.length > 0"
        class="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border rounded-md shadow-lg max-h-48 overflow-y-auto"
      >
        <div
          v-for="(procedure, index) in filteredProcedures"
          :key="procedure.name"
          @click="() => handleProcedureSelect(procedure)"
          :class="[
            'flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors',
            highlightedIndex === index && 'bg-accent text-accent-foreground',
          ]"
        >
          <div class="flex items-center gap-2 flex-1 min-w-0">
            <div
              v-if="procedure.visual.visualType === 'Color'"
              class="w-3 h-3 rounded-sm flex-shrink-0"
              :style="{ backgroundColor: procedure.visual.value }"
            />
            <span class="text-sm truncate">{{ procedure.name }}</span>
          </div>
          <span class="text-xs text-muted-foreground whitespace-nowrap ml-4 flex-shrink-0">
            [{{ getTargetText(procedure.name) }}]
          </span>
        </div>
      </div>
    </div>

    <!-- Selected Procedure Display -->
    <div v-if="selectedProcedure" class="w-full p-3 bg-muted rounded-md">
      <div class="flex items-center gap-3">
        <div
          v-if="selectedProcedure.visual.visualType === 'Color'"
          class="w-4 h-4 rounded-sm flex-shrink-0"
          :style="{ backgroundColor: selectedProcedure.visual.value }"
        />
        <div class="flex-1 min-w-0">
          <p class="font-medium text-sm">{{ selectedProcedure.name }}</p>
          <p class="text-xs text-muted-foreground">
            Target: {{ getTargetText(selectedProcedure.name) }}
          </p>
        </div>
        <Button variant="outline" size="sm" @click="handleClear" class="flex-shrink-0">
          Clear
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { X, ChevronDown } from 'lucide-vue-next'
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

// State
const containerRef = ref<HTMLElement>()
const isOpen = ref(false)
const searchValue = ref('')
const highlightedIndex = ref(-1)

// Computed
const filteredProcedures = computed(() => {
  if (!searchValue.value) return props.palette
  return props.palette.filter((procedure) =>
    procedure.name.toLowerCase().includes(searchValue.value.toLowerCase()),
  )
})

// Methods
const getTargetText = (procedureName: string) => {
  const target = props.targetMap[procedureName]
  return Array.isArray(target) ? target.join(', ') : target
}

const handleSearchChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  searchValue.value = value
  emit('search-change', value)
  isOpen.value = true
  highlightedIndex.value = -1
}

const handleProcedureSelect = (procedure: Procedure) => {
  emit('select', procedure)
  // Clear the input after selection
  searchValue.value = ''
  emit('search-change', '')
  isOpen.value = false
  highlightedIndex.value = -1
}

const handleClear = () => {
  emit('clear')
  searchValue.value = ''
  emit('search-change', '')
  isOpen.value = false
  highlightedIndex.value = -1
}

const handleClearInput = () => {
  // Clear both the input and any selected procedure
  emit('clear')
  searchValue.value = ''
  emit('search-change', '')
  isOpen.value = false
  highlightedIndex.value = -1
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (!isOpen.value) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      highlightedIndex.value = Math.min(
        highlightedIndex.value + 1,
        filteredProcedures.value.length - 1,
      )
      break
    case 'ArrowUp':
      event.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (highlightedIndex.value >= 0 && filteredProcedures.value[highlightedIndex.value]) {
        handleProcedureSelect(filteredProcedures.value[highlightedIndex.value])
      }
      break
    case 'Escape':
      event.preventDefault()
      isOpen.value = false
      highlightedIndex.value = -1
      break
  }
}

const handleClickOutside = (event: Event) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    isOpen.value = false
    highlightedIndex.value = -1
  }
}

// Reset highlighted index when filtered procedures change
watch(filteredProcedures, () => {
  highlightedIndex.value = -1
})

// Watchers
watch(
  () => props.selectedProcedure,
  (newProcedure) => {
    // Don't automatically fill the input when a procedure is selected
    // Keep input clear for next search
    if (!newProcedure) {
      searchValue.value = ''
    }
  },
  { immediate: true },
)

watch(
  () => props.search,
  (newSearch) => {
    if (newSearch !== searchValue.value) {
      searchValue.value = newSearch
    }
  },
)

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
