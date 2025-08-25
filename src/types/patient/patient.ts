export interface Patient {
  id: string // GUID
  firstName: string
  lastName: string
  isActive: boolean
  updatedAt: Date
  createdAt: Date
}

export interface PatientFilters {
  search?: string
  isActive?: boolean | null
  dateFrom?: Date
  dateTo?: Date
}

export interface PatientSortOptions {
  field: keyof Patient
  direction: 'asc' | 'desc'
}

// Helper type for table display
export interface PatientTableRow extends Patient {
  fullName: string
  status: 'Active' | 'Inactive'
  formattedCreationDate: string
  formattedUpdateDate: string
}
