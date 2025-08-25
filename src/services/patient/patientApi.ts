import type { AddPatient, Patient, PatientFilters } from '@/types/patient/patient'
import { api } from '../api'

// API Response types
interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
  error?: string
}

// Types for API operations
type CreatePatientData = AddPatient
type UpdatePatientData = Partial<Omit<Patient, 'id' | 'creationDate'>>
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

  async createPatient(patientData: AddPatient): Promise<ApiResponse<Patient>> {
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

export const patientApi = new RealPatientApi()

// Export for testing or direct usage
export { RealPatientApi }

// Export types
export type { CreatePatientData, UpdatePatientData }
