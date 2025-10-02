import { ref, computed } from 'vue'
import type { ProcedureConfig } from '@/types/odontogram/odontogram'
import { api } from '../api'
import { createMockProcedures } from './mocks/procedureMocks'

// Composable for managing procedure configurations
export function useProcedureConfig() {
  const procedureConfigs = ref<ProcedureConfig[]>([])
  const isLoading = ref(false)
  const isLoaded = ref(false)

  // Computed map for quick lookup by ID
  const procedureConfigMap = computed(() => {
    const map = new Map<string, ProcedureConfig>()
    procedureConfigs.value.forEach(config => {
      map.set(config.id, config)
    })
    return map
  })

  // Computed map for quick lookup by name (for backward compatibility)
  const procedureConfigByName = computed(() => {
    const map = new Map<string, ProcedureConfig>()
    procedureConfigs.value.forEach(config => {
      map.set(config.name, config)
    })
    return map
  })

  // Fetch procedure configurations from API
  const fetchProcedureConfigs = async (): Promise<void> => {
    if (isLoaded.value) return // Don't fetch if already loaded

    try {
      isLoading.value = true

      // TODO: Replace with real API call when ready
      // const configs = await api.get<ProcedureConfig[]>('/api/procedures/configs')

      // Convert mock procedures to ProcedureConfig format with IDs
      const mockProcedures = createMockProcedures()
      const configs: ProcedureConfig[] = mockProcedures.map((procedure, index) => ({
        id: `proc_${String(index + 1).padStart(3, '0')}`, // Generate IDs: proc_001, proc_002, etc.
        name: procedure.name,
        visual: procedure.visual,
        behavior: procedure.behavior
      }))

      procedureConfigs.value = configs
      isLoaded.value = true
    } catch (error) {
      console.error('Error fetching procedure configurations:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Get procedure config by ID
  const getProcedureConfigById = (id: string): ProcedureConfig | undefined => {
    return procedureConfigMap.value.get(id)
  }

  // Get procedure config by name (for backward compatibility)
  const getProcedureConfigByName = (name: string): ProcedureConfig | undefined => {
    return procedureConfigByName.value.get(name)
  }

  // Convert procedure reference to full procedure (for display)
  const resolveProcedureReference = (procedureId: string, procedureName: string) => {
    const config = getProcedureConfigById(procedureId)
    if (config) {
      return {
        id: config.id,
        name: config.name,
        visual: config.visual,
        behavior: config.behavior
      }
    }

    // Try to find by name as fallback
    const configByName = getProcedureConfigByName(procedureName)
    if (configByName) {
      return {
        id: configByName.id,
        name: configByName.name,
        visual: configByName.visual,
        behavior: configByName.behavior
      }
    }

    // Not found - return minimal fallback
    console.error(`Procedure config not found for ID: ${procedureId}, name: ${procedureName}`)
    return {
      id: procedureId,
      name: procedureName,
      visual: { visualType: 'Color' as any, value: '#ff0000' },
      behavior: 'None' as any
    }
  }

  return {
    procedureConfigs,
    isLoading,
    isLoaded,
    procedureConfigMap,
    procedureConfigByName,
    fetchProcedureConfigs,
    getProcedureConfigById,
    getProcedureConfigByName,
    resolveProcedureReference
  }
}

// Singleton instance for global use
export const procedureConfigService = useProcedureConfig()