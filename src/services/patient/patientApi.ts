import type {
  AddPatient,
  Patient,
  PatientDetails,
  PatientFilters,
  UpdatePatient,
} from '@/types/patient/patient'
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
type UpdatePatientData = UpdatePatient
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
      const data = await api.put<Patient>(`/api/patients/${id}`, patientData)

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

  async getPatientById(id: string): Promise<ApiResponse<PatientDetails>> {
    try {
      const data = await api.get<PatientDetails>(`/api/patients/${id}`)

      return {
        data,
        success: true,
        message: 'Patient retrieved successfully',
      }
    } catch (error) {
      return {
        data: {} as PatientDetails,
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve patient',
      }
    }
  }

  // Treatment Plans
  async getTreatmentPlans(patientId: string): Promise<ApiResponse<any[]>> {
    try {
      const data = await api.get<any[]>(`/api/patients/${patientId}/treatment-plans`)

      return {
        data,
        success: true,
        message: 'Treatment plans retrieved successfully',
      }
    } catch (error) {
      return {
        data: [],
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch treatment plans',
      }
    }
  }

  async createTreatmentPlan(
    patientId: string,
    planData: { name: string; isChild: boolean },
  ): Promise<ApiResponse<any>> {
    try {
      const data = await api.post<any>('/api/treatment-plans', {
        Name: planData.name,
        PatientId: patientId,
        IsPediatric: planData.isChild,
      })

      return {
        data,
        success: true,
        message: 'Treatment plan created successfully',
      }
    } catch (error) {
      return {
        data: {},
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create treatment plan',
      }
    }
  }

  async deleteTreatmentPlan(planId: string): Promise<ApiResponse<null>> {
    try {
      await api.delete(`/api/treatment-plans/${planId}`)

      return {
        data: null,
        success: true,
        message: 'Treatment plan deleted successfully',
      }
    } catch (error) {
      return {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete treatment plan',
      }
    }
  }

  // Notes
  async getNotes(patientId: string): Promise<ApiResponse<any[]>> {
    try {
      const data = await api.get<any[]>(`/api/patients/${patientId}/notes`)

      return {
        data,
        success: true,
        message: 'Notes retrieved successfully',
      }
    } catch (error) {
      return {
        data: [],
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch notes',
      }
    }
  }

  async createNote(patientId: string, content: string): Promise<ApiResponse<any>> {
    try {
      const data = await api.post<any>(`/api/patients/${patientId}/notes`, { content })

      return {
        data,
        success: true,
        message: 'Note created successfully',
      }
    } catch (error) {
      return {
        data: {},
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create note',
      }
    }
  }

  async updateNote(patientId: string, noteId: string, content: string): Promise<ApiResponse<any>> {
    try {
      const data = await api.put<any>(`/api/patients/${patientId}/notes/${noteId}`, { content })

      return {
        data,
        success: true,
        message: 'Note updated successfully',
      }
    } catch (error) {
      return {
        data: {},
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update note',
      }
    }
  }

  async deleteNote(patientId: string, noteId: string): Promise<ApiResponse<null>> {
    try {
      await api.delete(`/api/patients/${patientId}/notes/${noteId}`)

      return {
        data: null,
        success: true,
        message: 'Note deleted successfully',
      }
    } catch (error) {
      return {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete note',
      }
    }
  }
}

export const patientApi = new RealPatientApi()

// Export for testing or direct usage
export { RealPatientApi }

// Export types
export type { CreatePatientData, UpdatePatientData }
