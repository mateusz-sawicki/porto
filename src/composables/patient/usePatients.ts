import { patientApi, isUsingMockData } from '@/services/patient/patientApi'
import type {
  Patient,
  PatientFilters,
  PatientSortOptions,
  PatientTableRow,
} from '@/types/patient/patient'
import { ref, computed, reactive, readonly } from 'vue'

export function usePatients() {
  // State
  const patients = ref<Patient[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)

  // Filters and sorting
  const filters = reactive<PatientFilters>({
    search: '',
    isActive: null,
    dateFrom: undefined,
    dateTo: undefined,
  })

  const sortOptions = ref<PatientSortOptions>({
    field: 'createdAt',
    direction: 'desc',
  })

  // Computed filtered and sorted patients
  const filteredPatients = computed(() => {
    let result = patients.value

    // Search filter (client-side for better UX)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (patient) =>
          patient.firstName.toLowerCase().includes(searchLower) ||
          patient.lastName.toLowerCase().includes(searchLower) ||
          `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchLower),
      )
    }

    // Active status filter
    if (filters.isActive !== null && filters.isActive !== undefined) {
      result = result.filter((patient) => patient.isActive === filters.isActive)
    }

    // Date range filter
    if (filters.dateFrom) {
      result = result.filter((patient) => patient.createdAt >= filters.dateFrom!)
    }

    if (filters.dateTo) {
      result = result.filter((patient) => patient.createdAt <= filters.dateTo!)
    }

    return result
  })

  const sortedPatients = computed(() => {
    const result = [...filteredPatients.value]
    const { field, direction } = sortOptions.value

    result.sort((a, b) => {
      const aValue: any = a[field]
      const bValue: any = b[field]

      // Handle Date objects
      if (aValue instanceof Date && bValue instanceof Date) {
        const aTime = aValue.getTime()
        const bTime = bValue.getTime()
        return direction === 'asc' ? aTime - bTime : bTime - aTime
      }

      // Handle strings
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const aLower = aValue.toLowerCase()
        const bLower = bValue.toLowerCase()
        if (aLower < bLower) return direction === 'asc' ? -1 : 1
        if (aLower > bLower) return direction === 'asc' ? 1 : -1
        return 0
      }

      // Handle booleans and other types
      if (aValue < bValue) return direction === 'asc' ? -1 : 1
      if (aValue > bValue) return direction === 'asc' ? 1 : -1
      return 0
    })

    return result
  })

  // Transform for table display
  const tableData = computed<PatientTableRow[]>(() => {
    return sortedPatients.value.map((patient) => ({
      ...patient,
      fullName: `${patient.firstName} ${patient.lastName}`,
      status: patient.isActive ? 'Active' : ('Inactive' as 'Active' | 'Inactive'),
      formattedCreationDate: patient.createdAt.toLocaleDateString(),
      formattedUpdateDate: patient.updatedAt.toLocaleDateString(),
    }))
  })

  // Statistics
  const stats = computed(() => ({
    total: patients.value.length,
    active: patients.value.filter((p) => p.isActive).length,
    inactive: patients.value.filter((p) => !p.isActive).length,
    filtered: filteredPatients.value.length,
  }))

  // API Methods
  async function fetchPatients(forceRefresh = false): Promise<void> {
    if (loading.value || (initialized.value && !forceRefresh)) return

    loading.value = true
    error.value = null

    try {
      const response = await patientApi.getPatients()

      if (response.success) {
        // Convert date strings to Date objects if needed
        patients.value = response.data.map((patient) => ({
          ...patient,
          createdAt: new Date(patient.createdAt),
          updatedAt: new Date(patient.updatedAt),
        }))
        initialized.value = true
        console.log('✅ Patients loaded successfully:', patients.value.length)
      } else {
        throw new Error(response.error || 'Failed to fetch patients')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch patients'
      console.error('❌ Error fetching patients:', err)
    } finally {
      loading.value = false
    }
  }

  async function addPatient(
    patientData: Omit<Patient, 'id' | 'creationDate' | 'updateDate'>,
  ): Promise<Patient | null> {
    loading.value = true
    error.value = null

    try {
      const response = await patientApi.createPatient(patientData)

      if (response.success) {
        // Convert date strings to Date objects if needed
        const newPatient: Patient = {
          ...response.data,
          createdAt: new Date(response.data.createdAt),
          updatedAt: new Date(response.data.updatedAt),
        }

        // Add to local array at the beginning (newest first)
        patients.value.unshift(newPatient)

        return newPatient
      } else {
        throw new Error(response.error || 'Failed to create patient')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create patient'
      console.error('Error creating patient:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function updatePatient(
    id: string,
    patientData: Partial<Omit<Patient, 'id' | 'creationDate'>>,
  ): Promise<Patient | null> {
    loading.value = true
    error.value = null

    try {
      const response = await patientApi.updatePatient(id, patientData)

      if (response.success) {
        // Convert date strings to Date objects if needed
        const updatedPatient: Patient = {
          ...response.data,
          createdAt: new Date(response.data.createdAt),
          updatedAt: new Date(response.data.updatedAt),
        }

        // Update in local array
        const index = patients.value.findIndex((p) => p.id === id)
        if (index !== -1) {
          patients.value[index] = updatedPatient
        }

        return updatedPatient
      } else {
        throw new Error(response.error || 'Failed to update patient')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update patient'
      console.error('Error updating patient:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function deletePatient(id: string): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      const response = await patientApi.deletePatient(id)

      if (response.success) {
        // Remove from local array
        const index = patients.value.findIndex((p) => p.id === id)
        if (index !== -1) {
          patients.value.splice(index, 1)
        }

        return true
      } else {
        throw new Error(response.error || 'Failed to delete patient')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete patient'
      console.error('Error deleting patient:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  function getPatientById(id: string): Patient | undefined {
    return patients.value.find((p) => p.id === id)
  }

  function clearFilters() {
    filters.search = ''
    filters.isActive = null
    filters.dateFrom = undefined
    filters.dateTo = undefined
  }

  function setSorting(field: keyof Patient, direction: 'asc' | 'desc') {
    sortOptions.value = { field, direction }
  }

  function refreshPatients() {
    return fetchPatients(true)
  }

  // Auto-fetch on mount
  if (!initialized.value) {
    fetchPatients()
  }

  // Development helpers
  const isDevelopment = computed(() => isUsingMockData)

  return {
    // State
    patients: readonly(patients),
    loading: readonly(loading),
    error: readonly(error),
    initialized: readonly(initialized),

    // Computed data
    filteredPatients,
    sortedPatients,
    tableData,
    stats,

    // Filters
    filters,
    sortOptions: readonly(sortOptions),

    // Methods
    fetchPatients,
    addPatient,
    updatePatient,
    deletePatient,
    getPatientById,
    clearFilters,
    setSorting,
    refreshPatients,

    // Meta
    isDevelopment,
  }
}
