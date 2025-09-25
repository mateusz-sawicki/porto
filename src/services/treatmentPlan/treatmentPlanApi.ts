import { api } from '../api'
import { TreatmentPlanStatus } from '../../types/common/status'

// Types
export interface TreatmentPlan {
  id: string
  name: string
  createdAt: string
  modifiedAt: string
  currentStep: number
  isPediatric: boolean
  patientId: string
  isActive: boolean
  stepsDetails: { detailsStep: number; detailsData: any }[]
  stepsConfig: { [stepNumber: string]: any }
}

export interface TreatmentPlanFormTemplate {
  id: string
  clinicId: string
  name: string
  description?: string
  isDefault: boolean
  isActive: boolean
  steps: TreatmentPlanTemplateStep[]
  createdDate: string
}

export interface TreatmentPlanTemplateStep {
  id: string
  stepName: string
  title: string
  icon?: string
  stepOrder: number
  isRequired: boolean
  isActive: boolean
  configuration: any
}

export interface CreateTreatmentPlanRequest {
  name: string
  formTemplateId?: string
}

export interface CreateFormTemplateRequest {
  name: string
  description?: string
  isDefault: boolean
  steps: {
    stepName: string
    title: string
    icon?: string
    stepOrder: number
    isRequired: boolean
    configuration: any
  }[]
}

// Treatment Plan API Service
export class TreatmentPlanApiService {
  // Form Templates
  async getFormTemplatesByClinic(clinicId: string): Promise<TreatmentPlanFormTemplate[]> {
    return api.get(`/api/clinics/${clinicId}/form-templates`)
  }

  async getFormTemplateById(
    clinicId: string,
    templateId: string,
  ): Promise<TreatmentPlanFormTemplate> {
    return api.get(`/api/clinics/${clinicId}/form-templates/${templateId}`)
  }

  async createFormTemplate(
    clinicId: string,
    template: CreateFormTemplateRequest,
  ): Promise<TreatmentPlanFormTemplate> {
    return api.post(`/api/clinics/${clinicId}/form-templates`, template)
  }

  // Treatment Plans
  async getTreatmentPlansByPatient(patientId: string): Promise<TreatmentPlan[]> {
    return api.get(`/api/patients/${patientId}/treatment-plans`)
  }

  async getTreatmentPlanById(planId: string): Promise<TreatmentPlan> {
    return api.get(`/api/treatment-plans/${planId}`)
  }

  async createTreatmentPlan(
    patientId: string,
    plan: CreateTreatmentPlanRequest,
  ): Promise<TreatmentPlan> {
    return api.post(`/api/patients/${patientId}/treatment-plans`, plan)
  }

  // Step Data
  async saveStepData(
    patientId: string,
    planId: string,
    stepName: string,
    medicalInterviewStepData: any,
  ): Promise<void> {
    return api.put(
      `/api/patients/${patientId}/treatment-plans/${planId}/steps/${stepName}/data`,
      medicalInterviewStepData,
    )
  }

  async completeStep(patientId: string, planId: string, stepName: string): Promise<void> {
    return api.post(
      `/api/patients/${patientId}/treatment-plans/${planId}/steps/${stepName}/complete`,
    )
  }

  async updateTreatmentPlanProgress(
    planId: string,
    targetStep: number,
    medicalInterviewStepData: any,
  ): Promise<any> {
    return api.put(`/api/treatment-plans/${planId}`, {
      targetStep,
      medicalInterviewStepData,
    })
  }

  async saveProgress(planId: string, stepDetailsData: any): Promise<void> {
    return api.put(`/api/treatment-plans/${planId}/save-progress`, { stepDetailsData })
  }
}

// Export singleton instance
export const treatmentPlanApi = new TreatmentPlanApiService()
