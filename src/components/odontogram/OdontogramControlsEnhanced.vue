<!-- components/OdontogramControlsEnhanced.vue -->
<template>
  <div class="w-full space-y-4">
    <!-- Tartar Checkbox -->
    <div class="flex items-center space-x-2">
      <Checkbox id="tartar" />
      <label
        for="tartar"
        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Płytka bakteryjna/kamień
      </label>
    </div>

    <!-- Enhanced Procedure Selection -->
    <Popover v-model:open="open" :modal="false">
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
            <ProcedureIcon
              v-else-if="selectedProcedure && selectedProcedure.visual.visualType === 'Icon' && selectedProcedure.visual.value"
              :icon-name="selectedProcedure.visual.value"
              :icon-source="selectedProcedure.visual.iconSource"
              class="w-3 h-3 flex-shrink-0"
            />
            <span class="truncate text-left">
              {{ selectedProcedure ? selectedProcedure.name : 'Wybierz procedurę' }}
            </span>
          </div>
          <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        class="w-full p-0" 
        :style="{ width: triggerWidth }"
        side="bottom"
        align="start"
        :sideOffset="4"
        :avoidCollisions="false"
        :collisionPadding="0"
        :sticky="'always'"
      >
        <div class="h-96 overflow-hidden">
          <!-- Search and Filter -->
          <div class="p-3 border-b">
            <div class="relative mb-2">
              <Search
                class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
              />
              <Input
                v-model="searchQuery"
                placeholder="Szukaj procedury..."
                class="pl-10 pr-10"
                @input="handleSearchInput"
              />
              <Button
                v-if="searchQuery"
                variant="ghost"
                size="sm"
                class="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                @click="clearSearch"
              >
                <X class="h-3 w-3" />
              </Button>
            </div>

            <!-- Category Filter -->
            <div class="flex gap-1 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                :class="{ 'bg-primary text-primary-foreground': !selectedCategory }"
                @click="setSelectedCategory(null)"
              >
                Wszystkie
              </Button>
              <Button
                v-for="category in categories"
                :key="category"
                variant="outline"
                size="sm"
                :class="{ 'bg-primary text-primary-foreground': selectedCategory === category }"
                @click="setSelectedCategory(category)"
              >
                {{ category }}
              </Button>
            </div>
          </div>

          <!-- Procedures List -->
          <ScrollArea class="h-64 min-h-[256px]">
            <div class="p-2">
              <!-- Loading State -->
              <div v-if="isLoading" class="flex items-center justify-center py-8">
                <div class="flex items-center gap-2">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span class="text-sm text-muted-foreground">Ładowanie...</span>
                </div>
              </div>

              <!-- Error State -->
              <div v-else-if="error" class="text-center py-8">
                <AlertCircle class="h-8 w-8 text-destructive mx-auto mb-2" />
                <p class="text-sm text-destructive">{{ error }}</p>
                <Button variant="outline" size="sm" class="mt-2" @click="loadProcedures">
                  Spróbuj ponownie
                </Button>
              </div>

              <!-- Procedures -->
              <div v-else class="space-y-1">
                <!-- Grouped by Category -->
                <div v-if="!searchQuery && !selectedCategory" class="space-y-3">
                  <div v-for="category in categories" :key="category" class="space-y-1">
                    <h3 class="text-xs font-medium text-muted-foreground px-2">{{ category }}</h3>
                    <div class="space-y-1">
                      <ProcedureItem
                        v-for="procedure in proceduresByCategory[category]"
                        :key="procedure.name"
                        :procedure="procedure"
                        :is-selected="selectedProcedure?.name === procedure.name"
                        :available-targets="getAvailableTargets(procedure)"
                        @select="handleProcedureSelect"
                      />
                    </div>
                  </div>
                </div>

                <!-- Filtered Results -->
                <div v-else class="space-y-1">
                  <ProcedureItem
                    v-for="procedure in filteredProcedures"
                    :key="procedure.name"
                    :procedure="procedure"
                    :is-selected="selectedProcedure?.name === procedure.name"
                    :available-targets="getAvailableTargets(procedure)"
                    @select="handleProcedureSelect"
                  />

                  <!-- No Results -->
                  <div v-if="filteredProcedures.length === 0" class="text-center py-8">
                    <Search class="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p class="text-sm text-muted-foreground">Nie znaleziono procedur</p>
                    <div class="flex gap-2 justify-center mt-2">
                      <Button variant="outline" size="sm" @click="clearSearch">
                        Wyczyść wyszukiwanie
                      </Button>
                      <Button variant="outline" size="sm" @click="clearFilters">
                        Wyczyść filtry
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
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
        <ProcedureIcon
          v-else-if="selectedProcedure.visual.visualType === 'Icon' && selectedProcedure.visual.value"
          :icon-name="selectedProcedure.visual.value"
          :icon-source="selectedProcedure.visual.iconSource"
          class="w-4 h-4 flex-shrink-0"
        />
        <div class="flex-1 min-w-0">
          <p class="font-medium text-sm">{{ selectedProcedure.name }}</p>
          <p v-if="selectedProcedure.description" class="text-xs text-muted-foreground mt-1">
            {{ selectedProcedure.description }}
          </p>
          <div class="flex flex-wrap gap-1 mt-2">
            <Badge
              v-for="target in getAvailableTargets(selectedProcedure)"
              :key="target"
              variant="secondary"
              class="text-xs"
            >
              {{ target }}
            </Badge>
          </div>
        </div>
        <Button variant="outline" size="sm" @click="handleClear" class="flex-shrink-0">
          Wyczyść
        </Button>
      </div>
    </div>

    <!-- Add Teeth to Empty Slots -->
    <div v-if="hasSelectedEmptySlots" class="w-full p-3 bg-green-50 rounded-md border-2 border-green-200">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <p class="font-medium text-sm text-green-900 mb-1">Dodaj zęby</p>
          <p class="text-xs text-green-700">
            Wybrane puste miejsca: {{ selectedToothNumbers?.join(', ') || 'brak' }}
          </p>
        </div>
        <div class="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            @click="handleAddTeeth"
            class="text-xs border-green-300 hover:bg-green-100 bg-green-50"
          >
            + Dodaj zęby
          </Button>
        </div>
      </div>
    </div>

    <!-- Remove Teeth (Convert to Empty Slots) -->
    <div v-if="hasSelectedRealTeeth" class="w-full p-3 bg-red-50 rounded-md border-2 border-red-200">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <p class="font-medium text-sm text-red-900 mb-1">Usuń zęby</p>
          <p class="text-xs text-red-700">
            Wybrane zęby: {{ selectedToothNumbers?.join(', ') || 'brak' }}
          </p>
        </div>
        <div class="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            @click="handleRemoveTeeth"
            :disabled="!hasSelectedRealTeeth"
            class="text-xs border-red-300 hover:bg-red-100 bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            − Usuń zęby {{ selectedRemovableTeethCount ? `(${selectedRemovableTeethCount})` : '' }}
          </Button>
        </div>
      </div>
    </div>

    <!-- Tooth Conversion Controls -->
    <div class="w-full p-3 bg-blue-50 rounded-md border-2 border-blue-200">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <p class="font-medium text-sm text-blue-900 mb-1">Konwersja zębów</p>
          <p class="text-xs text-blue-700">
            Wybrane zęby: {{ selectedToothNumbers?.join(', ') || 'brak' }}
          </p>
        </div>
        <div class="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            @click="handleConvertToPrimary"
            :disabled="!availableConversions?.toPrimary.length"
            class="text-xs border-blue-300 hover:bg-blue-100 disabled:opacity-50"
          >
            → Młoczne {{ availableConversions?.toPrimary.length ? `(${availableConversions.toPrimary.length})` : '' }}
          </Button>
          <Button
            variant="outline"
            size="sm"
            @click="handleConvertToPermanent"
            :disabled="!availableConversions?.toPermanent.length"
            class="text-xs border-blue-300 hover:bg-blue-100 disabled:opacity-50"
          >
            → Stałe {{ availableConversions?.toPermanent.length ? `(${availableConversions.toPermanent.length})` : '' }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick, inject } from 'vue'
import { ChevronsUpDown, Search, AlertCircle, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { Procedure } from '@/types/odontogram/odontogram'
import type { ProcedureWithTarget } from '@/services/procedure/procedureApi'
import Checkbox from '../ui/checkbox/Checkbox.vue'
import ProcedureIcon from './ProcedureIcon.vue'
import ProcedureItem from './ProcedureItem.vue'
import { useProcedures } from '@/composables/procedure/useProcedures'
import type { useOdontogram } from '@/composables/odontogram/useOdontogram'

interface Props {
  selectedProcedure: ProcedureWithTarget | null
  search: string
  isProcedureMissing: boolean
}

interface Emits {
  (e: 'select', procedure: ProcedureWithTarget): void
  (e: 'clear'): void
  (e: 'search-change', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Inject odontogram composable for tooth conversions
const odontogram = inject<ReturnType<typeof useOdontogram>>('odontogram')
const { 
  selectedToothNumbers, 
  availableConversions, 
  convertSelectedTeethToPrimary, 
  convertSelectedTeethToPermanent,
  addTeethToSelectedEmptySlots,
  hasSelectedEmptySlots,
  removeSelectedTeeth,
  hasSelectedRealTeeth,
  selectedRemovableTeethCount
} = odontogram || {}

// State
const open = ref(false)
const triggerWidth = ref('400px')

// Use procedures composable
const {
  isLoading,
  error,
  searchQuery,
  selectedCategory,
  proceduresByCategory,
  categories,
  filteredProcedures,
  loadProcedures,
  searchProcedures,
  setSearchQuery,
  setSelectedCategory,
  clearFilters,
  getAvailableTargets,
} = useProcedures()

// Handle search input with debouncing
let searchTimeout: number | null = null
const handleSearchInput = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = window.setTimeout(() => {
    if (searchQuery.value.trim()) {
      searchProcedures(searchQuery.value)
    } else {
      loadProcedures()
    }
    emit('search-change', searchQuery.value)
  }, 300)
}

const handleProcedureSelect = (procedure: ProcedureWithTarget) => {
  emit('select', procedure)
  searchQuery.value = ''
  emit('search-change', '')
  open.value = false
}

const clearSearch = () => {
  searchQuery.value = ''
  setSearchQuery('')
  loadProcedures()
  emit('search-change', '')
}

const handleClear = () => {
  emit('clear')
  searchQuery.value = ''
  emit('search-change', '')
  open.value = false
}

// Tooth conversion handlers
const handleConvertToPrimary = () => {
  if (convertSelectedTeethToPrimary) {
    convertSelectedTeethToPrimary()
  }
}

const handleConvertToPermanent = () => {
  if (convertSelectedTeethToPermanent) {
    convertSelectedTeethToPermanent()
  }
}

// Add teeth to empty slots handler
const handleAddTeeth = () => {
  if (addTeethToSelectedEmptySlots) {
    addTeethToSelectedEmptySlots()
  }
}

// Remove teeth handler
const handleRemoveTeeth = () => {
  if (removeSelectedTeeth) {
    removeSelectedTeeth()
  }
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
      searchQuery.value = ''
      setSearchQuery('')
      loadProcedures()
    }
  },
  { immediate: true },
)

watch(
  () => props.search,
  (newSearch) => {
    if (newSearch !== searchQuery.value) {
      searchQuery.value = newSearch
    }
  },
)

// Reset search when popover closes
watch(open, (isOpen) => {
  if (!isOpen) {
    searchQuery.value = ''
    setSearchQuery('')
    loadProcedures()
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

<style scoped>
/* Prevent popover jumping during content changes */
:deep([data-radix-popper-content-wrapper]) {
  transition: none !important;
}

:deep([data-radix-popper-content]) {
  transition: none !important;
}

/* Ensure popover appears at bottom */
:deep([data-radix-popper-content]) {
  transform-origin: top !important;
}

/* Force bottom positioning */
:deep([data-side="bottom"]) {
  top: 100% !important;
  bottom: auto !important;
}
</style>
