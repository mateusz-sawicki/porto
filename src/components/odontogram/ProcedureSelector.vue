<template>
  <div class="procedure-selector">
    <!-- Search and Filter Controls -->
    <div class="flex flex-col gap-3 mb-4">
      <!-- Search Input -->
      <div class="relative">
        <Search
          class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
        />
        <Input
          v-model="searchQuery"
          placeholder="Szukaj procedury..."
          class="pl-10"
          @input="handleSearchInput"
        />
      </div>

      <!-- Category Filter -->
      <div class="flex gap-2 flex-wrap">
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

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-8">
      <div class="flex items-center gap-2">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        <span class="text-sm text-muted-foreground">Ładowanie procedur...</span>
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

    <!-- Procedures List -->
    <div v-else class="space-y-2">
      <!-- Grouped by Category -->
      <div v-if="!searchQuery && !selectedCategory" class="space-y-4">
        <div v-for="category in categories" :key="category" class="space-y-2">
          <h3 class="text-sm font-medium text-muted-foreground px-2">{{ category }}</h3>
          <div class="grid grid-cols-1 gap-1">
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
          <Button variant="outline" size="sm" class="mt-2" @click="clearFilters">
            Wyczyść filtry
          </Button>
        </div>
      </div>
    </div>

    <!-- Selected Procedure Info -->
    <div v-if="selectedProcedure" class="mt-4 p-3 bg-muted rounded-lg">
      <h4 class="font-medium text-sm mb-2">Wybrana procedura:</h4>
      <div class="flex items-center gap-2 mb-2">
        <div
          v-if="selectedProcedure.visual.visualType === 'Color' && selectedProcedure.visual.value"
          class="w-4 h-4 rounded-sm"
          :style="{ backgroundColor: selectedProcedure.visual.value }"
        />
        <ProcedureIcon
          v-else-if="selectedProcedure.visual.visualType === 'Icon' && selectedProcedure.visual.value"
          :icon-name="selectedProcedure.visual.value"
          :icon-source="selectedProcedure.visual.iconSource!"
        />
        <span class="font-medium">{{ selectedProcedure.name }}</span>
      </div>
      <p v-if="selectedProcedure.description" class="text-xs text-muted-foreground mb-2">
        {{ selectedProcedure.description }}
      </p>
      <div class="flex flex-wrap gap-1">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Search, AlertCircle } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useProcedures } from '@/composables/procedure/useProcedures'
import type { Procedure } from '@/types/odontogram/odontogram'
import type { ProcedureWithTarget } from '@/services/procedure/procedureApi'
import ProcedureItem from './ProcedureItem.vue'
import ProcedureIcon from './ProcedureIcon.vue'

interface Props {
  selectedProcedure?: ProcedureWithTarget | null
  selectedTarget?: string | null
}

interface Emits {
  (e: 'select', procedure: ProcedureWithTarget): void
  (e: 'update:selectedProcedure', procedure: ProcedureWithTarget | null): void
}

const props = withDefaults(defineProps<Props>(), {
  selectedProcedure: null,
  selectedTarget: null,
})

const emit = defineEmits<Emits>()

// Use procedures composable
const {
  procedures,
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

// Filter procedures by target if provided
const targetFilteredProcedures = computed(() => {
  if (!props.selectedTarget) return filteredProcedures.value

  return filteredProcedures.value.filter((proc) =>
    getAvailableTargets(proc).some(
      (target) => target.toLowerCase() === props.selectedTarget!.toLowerCase(),
    ),
  )
})

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
  }, 300)
}

// Handle procedure selection
const handleProcedureSelect = (procedure: ProcedureWithTarget) => {
  emit('select', procedure)
  emit('update:selectedProcedure', procedure)
}

// Watch for target changes and filter procedures
watch(
  () => props.selectedTarget,
  (newTarget) => {
    if (newTarget) {
      // Optionally reload procedures or apply target filter
      console.log('Target changed to:', newTarget)
    }
  },
)

// Expose methods for parent components
defineExpose({
  loadProcedures,
  clearFilters,
  setSearchQuery,
  setSelectedCategory,
})
</script>

<style scoped>
.procedure-selector {
  width: 100%;
  max-width: 100%;
}
</style>
