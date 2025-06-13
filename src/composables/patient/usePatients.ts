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
    field: 'creationDate',
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
          patient.name.toLowerCase().includes(searchLower) ||
          patient.surname.toLowerCase().includes(searchLower) ||
          `${patient.name} ${patient.surname}`.toLowerCase().includes(searchLower),
      )
    }

    // Active status filter
    if (filters.isActive !== null && filters.isActive !== undefined) {
      result = result.filter((patient) => patient.isActive === filters.isActive)
    }

    // Date range filter
    if (filters.dateFrom) {
      result = result.filter((patient) => patient.creationDate >= filters.dateFrom!)
    }

    if (filters.dateTo) {
      result = result.filter((patient) => patient.creationDate <= filters.dateTo!)
    }

    return result
  })

  const sortedPatients = computed(() => {
    const result = [...filteredPatients.value]
    const { field, direction } = sortOptions.value

    result.sort((a, b) => {
      let aValue: any = a[field]
      let bValue: any = b[field]

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
      fullName: `${patient.name} ${patient.surname}`,
      status: patient.isActive ? 'Active' : ('Inactive' as 'Active' | 'Inactive'),
      formattedCreationDate: patient.creationDate.toLocaleDateString(),
      formattedUpdateDate: patient.updateDate.toLocaleDateString(),
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
          creationDate: new Date(patient.creationDate),
          updateDate: new Date(patient.updateDate),
        }))
        initialized.value = true
      } else {
        throw new Error('Failed to fetch patients')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch patients'
      console.error('Error fetching patients:', err)
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
    getPatientById,
    clearFilters,
    setSorting,
    refreshPatients,

    // Meta
    isDevelopment,
  }
}
