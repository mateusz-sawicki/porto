import type { Patient, PatientFilters } from '@/types/patient/patient'
import { createMockPatients } from './mocks/patientMocks'
import { api } from '../api'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7263'
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true'

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
          patient.firstName.toLowerCase().includes(searchLower) ||
          patient.lastName.toLowerCase().includes(searchLower),
      )
    }

    if (filters?.isActive !== undefined && filters.isActive !== null) {
      result = result.filter((patient) => patient.isActive === filters.isActive)
    }

    if (filters?.dateFrom) {
      result = result.filter((patient) => patient.createdAt >= filters.dateFrom!)
    }

    if (filters?.dateTo) {
      result = result.filter((patient) => patient.createdAt <= filters.dateTo!)
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
        createdAt: now,
        updatedAt: now,
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
        updatedAt: new Date(),
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

// Real API implementation using centralized API client
class RealPatientApi {
  async getPatients(filters?: PatientFilters): Promise<ApiResponse<Patient[]>> {
    try {
      const queryParams = new URLSearchParams()

      if (filters?.search) queryParams.append('search', filters.search)
      if (filters?.isActive !== undefined && filters.isActive !== null) {
        queryParams.append('isActive', String(filters.isActive))
      }
      if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom.toISOString())
      if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo.toISOString())

      const query = queryParams.toString()
      const endpoint = `/api/patients${query ? `?${query}` : ''}`

      const data = await api.get<Patient[]>(endpoint)

      return {
        data,
        success: true,
        message: 'Patients retrieved successfully',
      }
    } catch (error) {
      return {
        data: [] as Patient[],
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch patients',
      }
    }
  }

  async createPatient(patientData: CreatePatientData): Promise<ApiResponse<Patient>> {
    try {
      const data = await api.post<Patient>('/api/patients', patientData)

      return {
        data,
        success: true,
        message: 'Patient created successfully',
      }
    } catch (error) {
      return {
        data: {} as Patient,
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create patient',
      }
    }
  }

  async updatePatient(id: string, patientData: UpdatePatientData): Promise<ApiResponse<Patient>> {
    try {
      const data = await api.patch<Patient>(`/api/patients/${id}`, patientData)

      return {
        data,
        success: true,
        message: 'Patient updated successfully',
      }
    } catch (error) {
      return {
        data: {} as Patient,
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update patient',
      }
    }
  }

  async deletePatient(id: string): Promise<ApiResponse<null>> {
    try {
      await api.delete(`/api/patients/${id}`)

      return {
        data: null,
        success: true,
        message: 'Patient deleted successfully',
      }
    } catch (error) {
      return {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete patient',
      }
    }
  }

  async getPatientById(id: string): Promise<ApiResponse<Patient>> {
    try {
      const data = await api.get<Patient>(`/api/patients/${id}`)

      return {
        data,
        success: true,
        message: 'Patient retrieved successfully',
      }
    } catch (error) {
      return {
        data: {} as Patient,
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve patient',
      }
    }
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
