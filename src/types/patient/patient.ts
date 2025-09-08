import type { Gender } from './gender'
import type { SortDirection } from '../common/sort'
import type { PatientStatus } from '../common/status'

export interface Patient {
  id: string
  firstName: string
  lastName: string
  isActive: boolean
  updatedAt: Date
  createdAt: Date
}

export interface AddPatient {
  firstName: string
  lastName: string
  dateOfBirth: Date
  phoneNumber: string
  gender: Gender
  email: string
}

export interface UpdatePatient {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: Date
  phoneNumber: string
  gender: Gender
  email: string
}

export interface PatientFilters {
  search?: string
  isActive?: boolean | null
  dateFrom?: Date
  dateTo?: Date
}

export interface PatientSortOptions {
  field: keyof Patient
  direction: SortDirection
}

// Helper type for table display
export interface PatientTableRow extends Patient {
  fullName: string
  status: PatientStatus
  formattedCreationDate: string
  formattedUpdateDate: string
}

export interface PatientDetails {
  basicData: PatientBasicData
  contactData: PatientContactData
}
export interface PatientBasicData {
  id: string
  firstName: string
  lastName: string
  isActive: boolean
  updatedAt: Date
  createdAt: Date
  dateOfBirth: Date
  gender: number
  age: number
}

export interface PatientContactData {
  phoneNumber: string
  email: string
}
