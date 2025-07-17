<!-- components/OdontogramControls.vue -->
<template>
  <div class="w-full space-y-4">
    <Checkbox id="tartar" />
    <label
      for="tartar"
      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      Płytka bakteryjna/kamień
    </label>
    <!-- Procedure Selection -->
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          role="combobox"
          :aria-expanded="open"
          :class="
            cn(
              'w-full justify-between',
              selectedProcedure?.visual.visualType === 'Color' && 'pl-8',
              isProcedureMissing && 'border-red-500 animate-pulse',
            )
          "
        >
          <div class="flex items-center gap-2 flex-1 min-w-0">
            <div
              v-if="selectedProcedure?.visual.visualType === 'Color' && selectedProcedure.visual.value"
              class="w-3 h-3 rounded-sm flex-shrink-0"
              :style="{ backgroundColor: selectedProcedure.visual.value }"
            />
            <span class="truncate text-left">
              {{ selectedProcedure ? selectedProcedure.name : 'Wybierz procedurę' }}
            </span>
          </div>
          <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-full p-0" :style="{ width: triggerWidth }">
        <Command>
          <CommandInput
            v-model:model-value="searchValue"
            placeholder="Szukaj procedury..."
            @update:model-value="handleSearchChange"
          />
          <CommandList>
            <CommandEmpty>Nie znaleziono procedury.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                v-for="procedure in filteredProcedures"
                :key="procedure.name"
                :value="procedure.name"
                @select="() => handleProcedureSelect(procedure)"
                class="flex items-center justify-between"
              >
                <div class="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    v-if="procedure.visual.visualType === 'Color' && procedure.visual.value"
                    class="w-3 h-3 rounded-sm flex-shrink-0"
                    :style="{ backgroundColor: procedure.visual.value }"
                  />
                  <ProcedureIcon
                    v-else-if="procedure.visual.visualType === 'Icon' && procedure.visual.value"
                    :icon-name="procedure.visual.value"
                    :icon-source="procedure.visual.iconSource"
                  />

                  <span class="text-sm truncate">{{ procedure.name }}</span>
                </div>
                <span class="text-xs text-muted-foreground whitespace-nowrap ml-4 flex-shrink-0">
                  [{{ getTargetText(procedure.name) }}]
                </span>
                <Check
                  :class="
                    cn(
                      'ml-2 h-4 w-4',
                      selectedProcedure?.name === procedure.name ? 'opacity-100' : 'opacity-0',
                    )
                  "
                />
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>

    <!-- Selected Procedure Display -->
    <div v-if="selectedProcedure" class="w-full p-3 bg-muted rounded-md">
      <div class="flex items-center gap-3">
        <div
          v-if="selectedProcedure.visual.visualType === 'Color' && selectedProcedure.visual.value"
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
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { Procedure } from '@/types/odontogram/odontogram'
import Checkbox from '../ui/checkbox/Checkbox.vue'
import DynamicLucideIcon from './DynamicLucideIcon.vue'
import ProcedureIcon from './ProcedureIcon.vue'

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
const open = ref(false)
const searchValue = ref('')
const triggerWidth = ref('400px')

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

const handleSearchChange = (value: string) => {
  searchValue.value = value
  emit('search-change', value)
}

const handleProcedureSelect = (procedure: Procedure) => {
  emit('select', procedure)
  searchValue.value = ''
  emit('search-change', '')
  open.value = false
}

const handleClear = () => {
  emit('clear')
  searchValue.value = ''
  emit('search-change', '')
  open.value = false
}

// Calculate trigger width for popover positioning
const updateTriggerWidth = () => {
  nextTick(() => {
    const trigger = document.querySelector('[role="combobox"]') as HTMLElement
    if (trigger) {
      triggerWidth.value = `${trigger.offsetWidth}px`
    }
  })
}

// Watchers
watch(
  () => props.selectedProcedure,
  (newProcedure) => {
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

// Reset search when popover closes
watch(open, (isOpen) => {
  if (!isOpen) {
    searchValue.value = ''
    emit('search-change', '')
  } else {
    updateTriggerWidth()
  }
})

// Lifecycle
onMounted(() => {
  updateTriggerWidth()
})
</script>
