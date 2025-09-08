<template>
  <div class="container mx-auto p-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-2 text-muted-foreground">Loading patient details...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center py-12">
      <div class="text-center">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <Button @click="fetchPatientData" variant="outline">Try Again</Button>
      </div>
    </div>

    <!-- Patient Content -->
    <div v-else-if="patient">
      <!-- Patient Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold">
            {{ patient.basicData.firstName }} {{ patient.basicData.lastName }}
          </h1>
          <p class="text-muted-foreground">Patient ID: {{ route.params.id }}</p>
        </div>
        <Button @click="editPatient" variant="outline">
          <Edit class="w-4 h-4 mr-2" />
          Edit Patient
        </Button>
      </div>

      <!-- Patient Information Cards -->
      <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Personal Information -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center">
              <User class="w-5 h-5 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-2">
            <div>
              <Label class="text-sm font-medium">Date of Birth</Label>
              <p class="text-sm">{{ formatDate(patient.basicData.dateOfBirth.toString()) }}</p>
            </div>
            <div>
              <Label class="text-sm font-medium">Age</Label>
              <p class="text-sm">{{ patient.basicData.age }} years</p>
            </div>
            <div>
              <Label class="text-sm font-medium">Gender</Label>
              <p class="text-sm">{{ mapGenderEnumToString(patient.basicData.gender) }}</p>
            </div>
          </CardContent>
        </Card>

        <!-- Contact Information -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center">
              <Phone class="w-5 h-5 mr-2" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-2">
            <div>
              <Label class="text-sm font-medium">Phone</Label>
              <p class="text-sm">{{ patient.contactData.phoneNumber }}</p>
            </div>
            <div>
              <Label class="text-sm font-medium">Email</Label>
              <p class="text-sm">{{ patient.contactData.email }}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Treatment Plans Section -->
      <Card class="mb-6">
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle class="flex items-center">
              <FileText class="w-5 h-5 mr-2" />
              Treatment Plans ({{ treatmentPlans.length }})
            </CardTitle>
            <Button @click="createTreatmentPlan">
              <Plus class="w-4 h-4 mr-2" />
              New Treatment Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <!-- Treatment Plans Table -->
          <div v-if="treatmentPlans.length > 0" class="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Create Date</TableHead>
                  <TableHead class="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="plan in treatmentPlans" :key="plan.id">
                  <TableCell class="font-medium">{{ plan.name }}</TableCell>
                  <TableCell>{{ plan.provider }}</TableCell>
                  <TableCell>{{ formatDate(plan.startDate) }}</TableCell>
                  <TableCell>
                    <div class="flex items-center justify-center space-x-1">
                      <Button @click="viewPlan(plan.id)" variant="ghost" size="sm">
                        <Eye class="w-4 h-4" />
                      </Button>
                      <Button @click="editPlan(plan.id)" variant="ghost" size="sm">
                        <Edit class="w-4 h-4" />
                      </Button>
                      <Button @click="deletePlan(plan.id)" variant="ghost" size="sm">
                        <Trash2 class="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12">
            <FileText class="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 class="text-lg font-medium mb-2">No Treatment Plans</h3>
            <p class="text-muted-foreground mb-4">
              This patient doesn't have any treatment plans yet.
            </p>
            <Button @click="createTreatmentPlan">
              <Plus class="w-4 h-4 mr-2" />
              Create First Treatment Plan
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Notes Section -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle class="flex items-center">
              <FileText class="w-5 h-5 mr-2" />
              Notes ({{ notes.length }})
            </CardTitle>
            <Button @click="addNote">
              <Plus class="w-4 h-4 mr-2" />
              Add Note
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <!-- Notes List -->
          <div v-if="notes.length > 0" class="space-y-4">
            <div v-for="note in notes" :key="note.id" class="border rounded-lg p-4 bg-gray-50">
              <div class="flex justify-between items-start mb-2">
                <div class="text-sm text-muted-foreground">
                  {{ formatDateTime(note.updatedAt || note.createdAt) }} • {{ note.createdBy }}
                  <span v-if="note.updatedAt" class="text-xs text-blue-600">(edited)</span>
                </div>
                <div class="flex items-center space-x-1">
                  <Button @click="editNote(note)" variant="ghost" size="sm">
                    <Edit class="w-4 h-4" />
                  </Button>
                  <Button @click="deleteNote(note.id)" variant="ghost" size="sm">
                    <Trash2 class="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p class="text-sm leading-relaxed">{{ note.content }}</p>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12">
            <FileText class="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 class="text-lg font-medium mb-2">No Notes</h3>
            <p class="text-muted-foreground mb-4">No notes have been added for this patient yet.</p>
            <Button @click="addNote">
              <Plus class="w-4 h-4 mr-2" />
              Add First Note
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Note Add/Edit Dialog -->
      <Dialog v-model:open="noteDialog.open">
        <DialogContent class="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {{ noteDialog.mode === 'add' ? 'Add New Note' : 'Edit Note' }}
            </DialogTitle>
          </DialogHeader>
          <div class="grid gap-4 py-4">
            <div class="grid gap-2">
              <Label for="note-content">Note Content</Label>
              <Textarea
                id="note-content"
                v-model="noteDialog.content"
                placeholder="Enter note content..."
                class="min-h-[120px]"
                :disabled="loading"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" @click="cancelNoteDialog"> Cancel </Button>
            <Button @click="saveNote" :disabled="!noteDialog.content.trim()">
              {{ noteDialog.mode === 'add' ? 'Add Note' : 'Save Changes' }}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <!-- Delete Confirmation Dialog -->
      <Dialog v-model:open="deleteDialog.open">
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle class="flex items-center gap-2 text-red-600">
              <Trash2 class="w-5 h-5" />
              Delete Note
            </DialogTitle>
          </DialogHeader>
          <div class="py-4">
            <p class="text-sm text-muted-foreground mb-4">
              Are you sure you want to delete this note? This action cannot be undone.
            </p>
            <div class="bg-gray-50 rounded-lg p-3 border-l-4 border-red-200">
              <p class="text-sm font-medium text-gray-700 mb-1">Note content:</p>
              <p class="text-sm text-gray-600 line-clamp-3">
                {{ deleteDialog.noteContent }}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" @click="cancelDeleteNote"> Cancel </Button>
            <Button variant="destructive" @click="confirmDeleteNote">
              <Trash2 class="w-4 h-4 mr-2" />
              Delete Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <!-- Patient Edit Dialog -->
      <PatientDialog
        :open="editPatientDialog.open"
        :mode="DialogMode.Edit"
        :patient-id="route.params.id as string"
        :patient-data="editPatientDialog.patientData"
        @close="closeEditPatient"
        @update="handlePatientUpdate"
      />

      <!-- New Treatment Plan Dialog -->
      <TreatmentPlanDialog
        v-model:open="treatmentPlanDialog.open"
        :is-creating="treatmentPlanDialog.isCreating"
        @save="saveTreatmentPlan"
        @cancel="cancelTreatmentPlan"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { User, Phone, Heart, FileText, Plus, Edit, Eye, Trash2 } from 'lucide-vue-next'
import { patientApi } from '@/services/patient/patientApi'
import type { Patient, PatientDetails } from '@/types/patient/patient'
import PatientDialog from '@/components/patient/PatientDialog.vue'
import TreatmentPlanDialog from '@/components/treatment-plan/TreatmentPlanDialog.vue'
import { DialogMode } from '@/types/common/status'

// Type definitions

interface TreatmentPlan {
  id: string
  name: string
  condition: string
  provider: string
  startDate: string
  endDate: string | null
  status: string
  progress: number
  description: string
}

interface Note {
  id: string
  content: string
  createdAt: string
  createdBy: string
  updatedAt?: string
}

// Reactive state
const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref<string | null>(null)
const patient = ref<PatientDetails | null>(null)
const treatmentPlans = ref<TreatmentPlan[]>([])
const notes = ref<Note[]>([])

// Note dialog state
const noteDialog = ref({
  open: false,
  mode: 'add' as 'add' | 'edit',
  noteId: null as string | null,
  content: '',
})

// Delete confirmation dialog state
const deleteDialog = ref({
  open: false,
  noteId: null as string | null,
  noteContent: '',
})

// Edit patient dialog state
const editPatientDialog = ref({
  open: false,
  patientData: null as any,
})

// Treatment plan dialog state
const treatmentPlanDialog = ref({
  open: false,
  isCreating: false,
})

// Helper function to map gender enum to string
const mapGenderEnumToString = (genderEnum: number): string => {
  switch (genderEnum) {
    case 1:
      return 'Male'
    case 2:
      return 'Female'
    default:
      return 'Unknown'
  }
}

// Real API functions
const fetchPatient = async (patientId: string): Promise<PatientDetails> => {
  const response = await patientApi.getPatientById(patientId)
  if (!response.success) {
    throw new Error(response.error || 'Failed to fetch patient')
  }

  const apiData = response.data

  // Transform API response to match expected Patient interface
  return {
    basicData: apiData.basicData,
    contactData: apiData.contactData,
  }
}

const fetchTreatmentPlans = async (patientId: string): Promise<TreatmentPlan[]> => {
  const response = await patientApi.getTreatmentPlans(patientId)
  if (!response.success) {
    throw new Error(response.error || 'Failed to fetch treatment plans')
  }
  return response.data
}

const fetchNotes = async (patientId: string): Promise<Note[]> => {
  const response = await patientApi.getNotes(patientId)
  if (!response.success) {
    throw new Error(response.error || 'Failed to fetch notes')
  }
  return response.data
}


// Load patient data
const fetchPatientData = async () => {
  try {
    loading.value = true
    error.value = null

    const patientId = route.params.id as string

    // Fetch patient, treatment plans, and notes in parallel
    const [
      patientData,
      treatmentPlansData,
      //, notesData
    ] = await Promise.all([
      fetchPatient(patientId),
      fetchTreatmentPlans(patientId),
      //fetchNotes(patientId),
    ])

    patient.value = patientData
    treatmentPlans.value = treatmentPlansData
    //notes.value = notesData
  } catch (err) {
    error.value = (err as Error).message || 'Failed to load patient data'
    //console.error('Error fetching patient data:', err)
  } finally {
    loading.value = false
  }
}

// Helper functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'default'
    case 'completed':
      return 'secondary'
    case 'on hold':
      return 'outline'
    default:
      return 'default'
  }
}

// Action handlers
const editPatient = () => {
  if (!patient.value) return

  // Populate dialog with current patient data
  editPatientDialog.value = {
    open: true,
    patientData: {
      firstName: patient.value.basicData.firstName,
      lastName: patient.value.basicData.lastName,
      dateOfBirth: patient.value.basicData.dateOfBirth,
      gender: patient.value.basicData.gender,
      phoneNumber: patient.value.contactData.phoneNumber,
      email: patient.value.contactData.email,
    },
  }
}

const createTreatmentPlan = () => {
  treatmentPlanDialog.value.open = true
}

// Treatment plan handlers
const saveTreatmentPlan = async (planData: { name: string; isChild: boolean }) => {
  treatmentPlanDialog.value.isCreating = true

  try {
    const patientId = route.params.id as string
    const response = await patientApi.createTreatmentPlan(patientId, planData)

    if (response.success) {
      // Close dialog
      cancelTreatmentPlan()

      // Navigate to treatment plan creation page
      const planId = response.data.id || response.data.Id
      await router.push(`/patients/${patientId}/treatment-plan/${planId}`)
    } else {
      // Show error message to user
      alert(`Failed to create treatment plan: ${response.error || 'Unknown error'}`)
    }
  } catch (error) {
    console.error('Failed to create treatment plan:', error)
    // Show error message to user
    alert('Failed to create treatment plan. Please try again.')
  } finally {
    treatmentPlanDialog.value.isCreating = false
  }
}

const cancelTreatmentPlan = () => {
  treatmentPlanDialog.value.open = false
  treatmentPlanDialog.value.isCreating = false
}

const viewPlan = (planId: string) => {
  console.log('View treatment plan:', planId)
  // Navigate to treatment plan details
}

const editPlan = (planId: string) => {
  console.log('Edit treatment plan:', planId)
  // Navigate to edit treatment plan form
}

const deletePlan = async (planId: string) => {
  if (!confirm('Are you sure you want to delete this treatment plan?')) {
    return
  }

  try {
    const response = await patientApi.deleteTreatmentPlan(planId)

    if (response.success) {
      const planIndex = treatmentPlans.value.findIndex((plan) => plan.id === planId)
      if (planIndex !== -1) {
        treatmentPlans.value.splice(planIndex, 1)
      }
    } else {
      alert(`Failed to delete treatment plan: ${response.error || 'Unknown error'}`)
    }
  } catch (error) {
    console.error('Error deleting treatment plan:', error)
    alert('Failed to delete treatment plan. Please try again.')
  }
}

// Note action handlers
const addNote = () => {
  noteDialog.value = {
    open: true,
    mode: 'add',
    noteId: null,
    content: '',
  }
}

const editNote = (note: Note) => {
  noteDialog.value = {
    open: true,
    mode: 'edit',
    noteId: note.id,
    content: note.content,
  }
}

const saveNote = async () => {
  const content = noteDialog.value.content.trim()
  if (!content) return

  try {
    const patientId = route.params.id as string

    if (noteDialog.value.mode === 'add') {
      // Add new note
      const response = await patientApi.createNote(patientId, content)

      if (response.success) {
        notes.value.unshift(response.data)
      } else {
        alert(`Failed to save note: ${response.error || 'Unknown error'}`)
        return
      }
    } else {
      // Edit existing note
      const response = await patientApi.updateNote(patientId, noteDialog.value.noteId!, content)

      if (response.success) {
        const noteIndex = notes.value.findIndex((note) => note.id === noteDialog.value.noteId)
        if (noteIndex !== -1) {
          notes.value[noteIndex] = response.data
        }
      } else {
        alert(`Failed to save note: ${response.error || 'Unknown error'}`)
        return
      }
    }

    // Close dialog and reset
    cancelNoteDialog()
  } catch (error) {
    console.error('Error saving note:', error)
    alert('Failed to save note. Please try again.')
  }
}

const cancelNoteDialog = () => {
  noteDialog.value = {
    open: false,
    mode: 'add',
    noteId: null,
    content: '',
  }
}

const deleteNote = (noteId: string) => {
  const note = notes.value.find((n) => n.id === noteId)
  if (note) {
    deleteDialog.value = {
      open: true,
      noteId: noteId,
      noteContent: note.content,
    }
  }
}

const confirmDeleteNote = async () => {
  try {
    const patientId = route.params.id as string
    const response = await patientApi.deleteNote(patientId, deleteDialog.value.noteId!)

    if (response.success) {
      const noteIndex = notes.value.findIndex((note) => note.id === deleteDialog.value.noteId)
      if (noteIndex !== -1) {
        notes.value.splice(noteIndex, 1)
      }
      cancelDeleteNote()
    } else {
      alert(`Failed to delete note: ${response.error || 'Unknown error'}`)
    }
  } catch (error) {
    console.error('Error deleting note:', error)
    alert('Failed to delete note. Please try again.')
  }
}

const cancelDeleteNote = () => {
  deleteDialog.value = {
    open: false,
    noteId: null,
    noteContent: '',
  }
}

// Patient edit handlers
const closeEditPatient = () => {
  editPatientDialog.value = {
    open: false,
    patientData: null,
  }
}

const handlePatientUpdate = (updatedData: any) => {
  if (!patient.value) return

  // Update patient data
  patient.value.basicData = {
    ...patient.value.basicData,
    firstName: updatedData.firstName,
    lastName: updatedData.lastName,
    dateOfBirth: updatedData.dateOfBirth,
    gender: updatedData.gender,
  }

  patient.value.contactData = {
    ...patient.value.contactData,
    phoneNumber: updatedData.phoneNumber,
    email: updatedData.email,
  }
}

// Load data on component mount
onMounted(() => {
  fetchPatientData()
})
</script>
