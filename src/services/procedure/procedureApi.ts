import type { Procedure, ProcedureTargetMap } from '@/types/odontogram/odontogram'
import { ProcedureIconSource } from '@/types/odontogram/odontogram'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true'


// Enhanced procedure type with target information
export interface ProcedureWithTarget extends Procedure {
  targets: string | string[]
  description?: string
  isActive?: boolean
  category?: string
}

// API Response types
interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
  error?: string
}

// Mock API implementation
class MockProcedureApi {
  private mockProcedures: ProcedureWithTarget[] = []

  private delay() {
    return new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300))
  }

  private generateId(): string {
    return `proc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  async getProcedures(): Promise<ApiResponse<ProcedureWithTarget[]>> {
    await this.delay()

    const activeProcedures = this.mockProcedures.filter((proc) => proc.isActive !== false)

    return {
      data: activeProcedures,
      success: true,
      message: 'Procedures retrieved successfully',
    }
  }


  async searchProcedures(query: string): Promise<ApiResponse<ProcedureWithTarget[]>> {
    await this.delay()

    const searchLower = query.toLowerCase()
    const filteredProcedures = this.mockProcedures.filter(
      (proc) =>
        (proc.name.toLowerCase().includes(searchLower) ||
          proc.description?.toLowerCase().includes(searchLower)) &&
        proc.isActive !== false,
    )

    return {
      data: filteredProcedures,
      success: true,
      message: 'Procedures search completed successfully',
    }
  }

  async getProcedureTargets(): Promise<ApiResponse<ProcedureTargetMap>> {
    await this.delay()

    const targetMap: ProcedureTargetMap = {}
    this.mockProcedures.forEach((proc) => {
      targetMap[proc.name] = proc.targets
    })

    return {
      data: targetMap,
      success: true,
      message: 'Procedure targets retrieved successfully',
    }
  }

  async getProcedureByName(name: string): Promise<ApiResponse<ProcedureWithTarget | null>> {
    await this.delay()

    const procedure = this.mockProcedures.find((proc) => proc.name === name)

    return {
      data: procedure || null,
      success: true,
      message: procedure ? 'Procedure retrieved successfully' : 'Procedure not found',
    }
  }
}

// Real API implementation (ready for production)
class RealProcedureApi {
  private mapBehavior(behaviourValue: string | number): string {
    // Map API behavior values to expected enum values
    const behaviorMap: Record<string, string> = {
      '0': 'None',
      '1': 'CrossOutTooth',
      '2': 'HideTooth',
      '3': 'RootOnly',
      '4': 'Implant',
      '5': 'ImpactedTooth'
    }

    const key = String(behaviourValue || '0')
    return behaviorMap[key] || 'None'
  }

  private convertIconName(iconName: string | undefined, iconSource: string | undefined): string | undefined {
    if (!iconName || !iconSource) return iconName

    const source = iconSource.toLowerCase()

    // For Lucide icons: ensure PascalCase (API might send camelCase or correct format)
    if (source === 'lucide') {
      return iconName.charAt(0).toUpperCase() + iconName.slice(1)
    }

    // For Tabler icons: keep as-is
    return iconName
  }
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers here
          // 'Authorization': `Bearer ${getAuthToken()}`,
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          data: {} as T,
          success: false,
          error: data.message || `HTTP ${response.status}`,
        }
      }


      return {
        data: data, // Assuming API returns array directly, not wrapped in {data: ...}
        success: true,
      }
    } catch (error) {
      return {
        data: {} as T,
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      }
    }
  }

  async getProcedures(): Promise<ApiResponse<ProcedureWithTarget[]>> {
    const response = await this.request<any>('/api/conditions')

    if (response.success && response.data) {
      let apiData = response.data

      // Check if response.data is an object with numeric keys (convert to array)
      if (!Array.isArray(apiData) && typeof apiData === 'object') {
        apiData = Object.values(apiData)
      }

      // Ensure we have an array
      if (!Array.isArray(apiData)) {
        console.error('API response is not an array:', apiData)
        return {
          data: [],
          success: false,
          error: 'Invalid API response format'
        }
      }

      // Transform API data to expected format
      const transformedData: ProcedureWithTarget[] = apiData.map((item: any) => ({
        id: item.id,
        name: item.name,
        targets: item.targets,
        category: item.categoryName,
        description: item.categoryName, // Use category as description
        isActive: true,
        visual: {
          visualType: item.visual?.type || 'Color',
          value: this.convertIconName(item.visual?.value, item.visual?.iconSource),
          iconSource: item.visual?.iconSource?.toLowerCase()
        },
        behavior: this.mapBehavior(item.visual?.behaviour)
      }))


      return {
        data: transformedData,
        success: true,
        message: response.message
      }
    }

    return response as ApiResponse<ProcedureWithTarget[]>
  }


  async searchProcedures(query: string): Promise<ApiResponse<ProcedureWithTarget[]>> {
    return this.request<ProcedureWithTarget[]>(`/api/conditions/search?q=${encodeURIComponent(query)}`)
  }

  async getProcedureTargets(): Promise<ApiResponse<ProcedureTargetMap>> {
    return this.request<ProcedureTargetMap>('/procedures/targets')
  }

  async getProcedureByName(name: string): Promise<ApiResponse<ProcedureWithTarget | null>> {
    return this.request<ProcedureWithTarget | null>(`/procedures/${encodeURIComponent(name)}`)
  }
}

// Export the appropriate API instance
export const procedureApi = USE_MOCK_DATA ? new MockProcedureApi() : new RealProcedureApi()

// Helper function to check if procedure can be assigned to target
export function canAssignProcedureToTarget(
  procedure: ProcedureWithTarget,
  target: string,
): boolean {
  if (typeof procedure.targets === 'string') {
    return procedure.targets === target
  }

  if (Array.isArray(procedure.targets)) {
    return procedure.targets.includes(target)
  }

  return false
}

// Helper function to get available targets for a procedure
export function getAvailableTargets(procedure: ProcedureWithTarget): string[] {
  if (typeof procedure.targets === 'string') {
    return [procedure.targets]
  }

  if (Array.isArray(procedure.targets)) {
    return procedure.targets
  }

  return []
}

// Environment info
export const isUsingMockData = USE_MOCK_DATA
