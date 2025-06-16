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
  error?: string
}

// Types for API operations
type CreatePatientData = Omit<Patient, 'id' | 'creationDate' | 'updateDate'>
type UpdatePatientData = Partial<Omit<Patient, 'id' | 'creationDate'>>

// Mock API implementation
class MockPatientApi {
  private mockPatients: Patient[] = createMockPatients()

  private delay() {
    return new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 500))
  }

  private generateId(): string {
    return `patient-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
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

  async createPatient(patientData: CreatePatientData): Promise<ApiResponse<Patient>> {
    await this.delay()

    try {
      const now = new Date()
      const newPatient: Patient = {
        ...patientData,
        id: this.generateId(),
        creationDate: now,
        updateDate: now,
      }

      // Add to mock data
      this.mockPatients.unshift(newPatient)

      return {
        data: newPatient,
        success: true,
        message: 'Patient created successfully',
      }
    } catch (error) {
      return {
        data: {} as Patient,
        success: false,
        error: 'Failed to create patient',
      }
    }
  }

  async updatePatient(id: string, patientData: UpdatePatientData): Promise<ApiResponse<Patient>> {
    await this.delay()

    try {
      const patientIndex = this.mockPatients.findIndex((p) => p.id === id)

      if (patientIndex === -1) {
        return {
          data: {} as Patient,
          success: false,
          error: 'Patient not found',
        }
      }

      const updatedPatient: Patient = {
        ...this.mockPatients[patientIndex],
        ...patientData,
        updateDate: new Date(),
      }

      // Update in mock data
      this.mockPatients[patientIndex] = updatedPatient

      return {
        data: updatedPatient,
        success: true,
        message: 'Patient updated successfully',
      }
    } catch (error) {
      return {
        data: {} as Patient,
        success: false,
        error: 'Failed to update patient',
      }
    }
  }

  async deletePatient(id: string): Promise<ApiResponse<null>> {
    await this.delay()

    try {
      const patientIndex = this.mockPatients.findIndex((p) => p.id === id)

      if (patientIndex === -1) {
        return {
          data: null,
          success: false,
          error: 'Patient not found',
        }
      }

      // Remove from mock data
      this.mockPatients.splice(patientIndex, 1)

      return {
        data: null,
        success: true,
        message: 'Patient deleted successfully',
      }
    } catch (error) {
      return {
        data: null,
        success: false,
        error: 'Failed to delete patient',
      }
    }
  }

  async getPatientById(id: string): Promise<ApiResponse<Patient>> {
    await this.delay()

    try {
      const patient = this.mockPatients.find((p) => p.id === id)

      if (!patient) {
        return {
          data: {} as Patient,
          success: false,
          error: 'Patient not found',
        }
      }

      return {
        data: patient,
        success: true,
        message: 'Patient retrieved successfully',
      }
    } catch (error) {
      return {
        data: {} as Patient,
        success: false,
        error: 'Failed to retrieve patient',
      }
    }
  }
}

// Real API implementation (ready for production)
class RealPatientApi {
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
        ...data,
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

  async createPatient(patientData: CreatePatientData): Promise<ApiResponse<Patient>> {
    return this.request<Patient>('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    })
  }

  async updatePatient(id: string, patientData: UpdatePatientData): Promise<ApiResponse<Patient>> {
    return this.request<Patient>(`/patients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patientData),
    })
  }

  async deletePatient(id: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/patients/${id}`, {
      method: 'DELETE',
    })
  }

  async getPatientById(id: string): Promise<ApiResponse<Patient>> {
    return this.request<Patient>(`/patients/${id}`)
  }
}

// Export the appropriate API instance
export const patientApi = USE_MOCK_DATA ? new MockPatientApi() : new RealPatientApi()

// Export for testing or direct usage
export { MockPatientApi, RealPatientApi }

// Export types
export type { CreatePatientData, UpdatePatientData }

// Environment info
export const isUsingMockData = USE_MOCK_DATA
