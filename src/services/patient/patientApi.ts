import type { Patient, PatientFilters } from '@/types/patient/patient'
import { createMockPatients } from './mocks/patientMocks'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || import.meta.env.DEV

// API Response types
interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

// Mock API implementation
class MockPatientApi {
  private mockPatients: Patient[] = createMockPatients()

  private delay() {
    return new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 500))
  }

  async getPatients(filters?: PatientFilters): Promise<ApiResponse<Patient[]>> {
    await this.delay()

    let result = [...this.mockPatients]

    // Apply filters if provided
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchLower) ||
          patient.surname.toLowerCase().includes(searchLower),
      )
    }

    if (filters?.isActive !== undefined && filters.isActive !== null) {
      result = result.filter((patient) => patient.isActive === filters.isActive)
    }

    if (filters?.dateFrom) {
      result = result.filter((patient) => patient.creationDate >= filters.dateFrom!)
    }

    if (filters?.dateTo) {
      result = result.filter((patient) => patient.creationDate <= filters.dateTo!)
    }

    return {
      data: result,
      success: true,
      message: 'Patients retrieved successfully',
    }
  }
}

// Real API implementation (ready for production)
class RealPatientApi {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers here
        // 'Authorization': `Bearer ${getAuthToken()}`,
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async getPatients(filters?: PatientFilters): Promise<ApiResponse<Patient[]>> {
    const queryParams = new URLSearchParams()

    if (filters?.search) queryParams.append('search', filters.search)
    if (filters?.isActive !== undefined && filters.isActive !== null) {
      queryParams.append('isActive', String(filters.isActive))
    }
    if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom.toISOString())
    if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo.toISOString())

    const query = queryParams.toString()
    return this.request<Patient[]>(`/patients${query ? `?${query}` : ''}`)
  }
}

// Export the appropriate API instance
export const patientApi = USE_MOCK_DATA ? new MockPatientApi() : new RealPatientApi()

// Export for testing or direct usage
export { MockPatientApi, RealPatientApi }

// Environment info
export const isUsingMockData = USE_MOCK_DATA
