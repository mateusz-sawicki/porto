import { ref, computed, onMounted } from 'vue'
import { procedureApi, type ProcedureWithTarget, canAssignProcedureToTarget, getAvailableTargets } from '@/services/procedure/procedureApi'

export function useProcedures() {
  const procedures = ref<ProcedureWithTarget[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const selectedCategory = ref<string | null>(null)

  // Load procedures on mount
  onMounted(async () => {
    await loadProcedures()
  })

  // Load all procedures
  const loadProcedures = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await procedureApi.getProcedures()
      
      if (response.success) {
        procedures.value = response.data
      } else {
        error.value = response.error || 'Failed to load procedures'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
    } finally {
      isLoading.value = false
    }
  }

  // Search procedures
  const searchProcedures = async (query: string) => {
    if (!query.trim()) {
      await loadProcedures()
      return
    }

    isLoading.value = true
    error.value = null
    
    try {
      const response = await procedureApi.searchProcedures(query)
      
      if (response.success) {
        procedures.value = response.data
      } else {
        error.value = response.error || 'Failed to search procedures'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
    } finally {
      isLoading.value = false
    }
  }

  // Get procedures by category
  const loadProceduresByCategory = async (category: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await procedureApi.getProceduresByCategory(category)
      
      if (response.success) {
        procedures.value = response.data
      } else {
        error.value = response.error || 'Failed to load procedures by category'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
    } finally {
      isLoading.value = false
    }
  }

  // Computed properties
  const activeProcedures = computed(() => 
    procedures.value.filter(proc => proc.isActive !== false)
  )

  const proceduresByCategory = computed(() => {
    const grouped: Record<string, ProcedureWithTarget[]> = {}
    
    activeProcedures.value.forEach(proc => {
      const category = proc.category || 'Other'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(proc)
    })
    
    return grouped
  })

  const categories = computed(() => 
    Object.keys(proceduresByCategory.value).sort()
  )

  const filteredProcedures = computed(() => {
    let filtered = activeProcedures.value

    // Filter by search query
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(proc => 
        proc.name.toLowerCase().includes(query) ||
        proc.description?.toLowerCase().includes(query) ||
        proc.category?.toLowerCase().includes(query)
      )
    }

    // Filter by category
    if (selectedCategory.value) {
      filtered = filtered.filter(proc => proc.category === selectedCategory.value)
    }

    return filtered
  })

  // Helper methods
  const getProcedureByName = (name: string): ProcedureWithTarget | undefined => {
    return activeProcedures.value.find(proc => proc.name === name)
  }

  const getProceduresForTarget = (target: string): ProcedureWithTarget[] => {
    return activeProcedures.value.filter(proc => 
      canAssignProcedureToTarget(proc, target)
    )
  }

  const getProceduresForTargets = (targets: string[]): ProcedureWithTarget[] => {
    return activeProcedures.value.filter(proc => 
      targets.some(target => canAssignProcedureToTarget(proc, target))
    )
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const setSelectedCategory = (category: string | null) => {
    selectedCategory.value = category
  }

  const clearFilters = () => {
    searchQuery.value = ''
    selectedCategory.value = null
  }

  return {
    // State
    procedures: activeProcedures,
    isLoading,
    error,
    searchQuery,
    selectedCategory,

    // Computed
    proceduresByCategory,
    categories,
    filteredProcedures,

    // Methods
    loadProcedures,
    searchProcedures,
    loadProceduresByCategory,
    getProcedureByName,
    getProceduresForTarget,
    getProceduresForTargets,
    setSearchQuery,
    setSelectedCategory,
    clearFilters,
    
    // Helper functions
    canAssignProcedureToTarget,
    getAvailableTargets,
  }
} 