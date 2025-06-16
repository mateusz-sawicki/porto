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
          <h1 class="text-3xl font-bold">{{ patient.firstName }} {{ patient.lastName }}</h1>
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
              <p class="text-sm">{{ formatDate(patient.dateOfBirth) }}</p>
            </div>
            <div>
              <Label class="text-sm font-medium">Age</Label>
              <p class="text-sm">{{ calculateAge(patient.dateOfBirth) }} years</p>
            </div>
            <div>
              <Label class="text-sm font-medium">Gender</Label>
              <p class="text-sm">{{ patient.gender }}</p>
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
              <p class="text-sm">{{ patient.phone }}</p>
            </div>
            <div>
              <Label class="text-sm font-medium">Email</Label>
              <p class="text-sm">{{ patient.email }}</p>
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

      <!-- Edit Patient Dialog -->
      <Dialog v-model:open="editPatientDialog.open">
        <DialogContent class="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle class="flex items-center gap-2">
              <Edit class="w-5 h-5" />
              Edit Patient Information
            </DialogTitle>
          </DialogHeader>
          <div class="grid gap-6 py-6">
            <div class="grid grid-cols-2 gap-6">
              <div class="grid gap-2">
                <Label for="first-name">First Name</Label>
                <Input
                  id="first-name"
                  v-model="editPatientDialog.firstName"
                  placeholder="Enter first name"
                />
              </div>
              <div class="grid gap-2">
                <Label for="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  v-model="editPatientDialog.lastName"
                  placeholder="Enter last name"
                />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-6">
              <div class="grid gap-2">
                <Label for="date-of-birth">Date of Birth</Label>
                <Input
                  id="date-of-birth"
                  type="date"
                  v-model="editPatientDialog.dateOfBirth"
                  class="w-full"
                />
              </div>
              <div class="grid gap-2">
                <Label for="gender">Gender</Label>
                <Select
                  :model-value="editPatientDialog.gender"
                  @update:model-value="editPatientDialog.gender = $event"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-6">
              <div class="grid gap-2">
                <Label for="phone">Phone</Label>
                <Input
                  id="phone"
                  v-model="editPatientDialog.phone"
                  placeholder="Enter phone number"
                />
              </div>
              <div class="grid gap-2">
                <Label for="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  v-model="editPatientDialog.email"
                  placeholder="Enter email address"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" @click="cancelEditPatient"> Cancel </Button>
            <Button @click="savePatientChanges" :disabled="!isPatientFormValid">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
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
import { Input } from '@/components/ui/input'
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

// Mock Data - Single patient for development
const mockPatient = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  firstName: 'Sarah',
  lastName: 'Johnson',
  dateOfBirth: '1985-03-15',
  gender: 'Female',
  phone: '+1 (555) 123-4567',
  email: 'sarah.johnson@email.com',
  createdAt: '2023-01-15T10:30:00Z',
  updatedAt: '2024-06-10T14:22:00Z',
}

const mockTreatmentPlans = [
  {
    id: 'tp-001',
    name: 'Post-Surgery Recovery Protocol',
    condition: 'Knee Replacement Recovery',
    provider: 'Dr. Smith (Orthopedics)',
    startDate: '2024-01-15',
    endDate: '2024-07-15',
    status: 'Active',
    progress: 75,
    description: 'Comprehensive recovery plan including physical therapy and pain management',
  },
  {
    id: 'tp-002',
    name: 'Physical Therapy - Lower Back',
    condition: 'Chronic Lower Back Pain',
    provider: 'Sarah Williams, PT',
    startDate: '2024-02-01',
    endDate: null,
    status: 'Active',
    progress: 45,
    description: 'Targeted exercises to strengthen core and improve mobility',
  },
  {
    id: 'tp-003',
    name: 'Diabetes Management Program',
    condition: 'Type 2 Diabetes',
    provider: 'Dr. Johnson (Endocrinology)',
    startDate: '2023-11-20',
    endDate: '2024-05-20',
    status: 'Completed',
    progress: 100,
    description: 'Comprehensive diabetes education and medication optimization',
  },
  {
    id: 'tp-004',
    name: 'Hypertension Control Plan',
    condition: 'High Blood Pressure',
    provider: 'Dr. Brown (Cardiology)',
    startDate: '2024-03-10',
    endDate: null,
    status: 'On Hold',
    progress: 20,
    description: 'Lifestyle modifications and medication management',
  },
]

const mockNotes = [
  {
    id: 'note-001',
    content:
      'Patient reports significant improvement in knee mobility following physical therapy sessions. Range of motion has increased by approximately 30% since last visit. Continuing with current exercise regimen.',
    createdAt: '2024-06-10T14:30:00Z',
    createdBy: 'Dr. Smith',
  },
  {
    id: 'note-002',
    content:
      'Blood pressure readings have been consistently elevated over the past month. Patient admits to not taking medication as prescribed. Discussed importance of medication compliance and scheduled follow-up in 2 weeks.',
    createdAt: '2024-06-08T09:15:00Z',
    createdBy: 'Dr. Brown',
  },
  {
    id: 'note-003',
    content:
      'Patient expressed concerns about managing diabetes during upcoming vacation. Provided travel guidelines and adjusted insulin timing. Emergency contact information updated.',
    createdAt: '2024-05-28T16:45:00Z',
    createdBy: 'Dr. Johnson',
  },
]

// Reactive state
const route = useRoute()
const loading = ref(true)
const error = ref(null)
const patient = ref(null)
const treatmentPlans = ref([])
const notes = ref([])

// Note dialog state
const noteDialog = ref({
  open: false,
  mode: 'add', // 'add' or 'edit'
  noteId: null,
  content: '',
})

// Delete confirmation dialog state
const deleteDialog = ref({
  open: false,
  noteId: null,
  noteContent: '',
})

// Edit patient dialog state
const editPatientDialog = ref({
  open: false,
  firstName: '',
  lastName: '',
  dateOfBirth: '', // Keep as string for easier handling
  gender: '',
  phone: '',
  email: '',
})

// Mock API functions (replace these with real API calls)
const fetchPatient = async (patientId) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Always return the same mock patient for development
  return mockPatient
}

const fetchTreatmentPlans = async (patientId) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Always return the same mock treatment plans for development
  return mockTreatmentPlans
}

const fetchNotes = async (patientId) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Always return the same mock notes for development
  return mockNotes
}

// Load patient data
const fetchPatientData = async () => {
  try {
    loading.value = true
    error.value = null

    const patientId = route.params.id

    // Fetch patient, treatment plans, and notes in parallel
    const [patientData, treatmentPlansData, notesData] = await Promise.all([
      fetchPatient(patientId),
      fetchTreatmentPlans(patientId),
      fetchNotes(patientId),
    ])

    patient.value = patientData
    treatmentPlans.value = treatmentPlansData
    notes.value = notesData
  } catch (err) {
    error.value = err.message || 'Failed to load patient data'
    console.error('Error fetching patient data:', err)
  } finally {
    loading.value = false
  }
}

// Helper functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const calculateAge = (dateOfBirth) => {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

const getStatusVariant = (status) => {
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
  // Populate dialog with current patient data
  editPatientDialog.value = {
    open: true,
    firstName: patient.value.firstName,
    lastName: patient.value.lastName,
    dateOfBirth: patient.value.dateOfBirth, // Keep as string
    gender: patient.value.gender,
    phone: patient.value.phone,
    email: patient.value.email,
  }
}

const createTreatmentPlan = () => {
  console.log('Create new treatment plan for patient:', route.params.id)
  // Navigate to create treatment plan form
}

const viewPlan = (planId) => {
  console.log('View treatment plan:', planId)
  // Navigate to treatment plan details
}

const editPlan = (planId) => {
  console.log('Edit treatment plan:', planId)
  // Navigate to edit treatment plan form
}

const deletePlan = (planId) => {
  console.log('Delete treatment plan:', planId)
  // Show confirmation dialog and delete
  const planIndex = treatmentPlans.value.findIndex((plan) => plan.id === planId)
  if (planIndex !== -1) {
    treatmentPlans.value.splice(planIndex, 1)
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

const editNote = (note) => {
  noteDialog.value = {
    open: true,
    mode: 'edit',
    noteId: note.id,
    content: note.content,
  }
}

const saveNote = () => {
  const content = noteDialog.value.content.trim()

  if (!content) return

  if (noteDialog.value.mode === 'add') {
    // Add new note
    const newNote = {
      id: `note-${Date.now()}`,
      content: content,
      createdAt: new Date().toISOString(),
      createdBy: 'Current User',
    }
    notes.value.unshift(newNote)
  } else {
    // Edit existing note
    const noteIndex = notes.value.findIndex((note) => note.id === noteDialog.value.noteId)
    if (noteIndex !== -1) {
      notes.value[noteIndex] = {
        ...notes.value[noteIndex],
        content: content,
        updatedAt: new Date().toISOString(),
      }
    }
  }

  // Close dialog and reset
  cancelNoteDialog()
}

const cancelNoteDialog = () => {
  noteDialog.value = {
    open: false,
    mode: 'add',
    noteId: null,
    content: '',
  }
}

const deleteNote = (noteId) => {
  const note = notes.value.find((n) => n.id === noteId)
  if (note) {
    deleteDialog.value = {
      open: true,
      noteId: noteId,
      noteContent: note.content,
    }
  }
}

const confirmDeleteNote = () => {
  const noteIndex = notes.value.findIndex((note) => note.id === deleteDialog.value.noteId)
  if (noteIndex !== -1) {
    notes.value.splice(noteIndex, 1)
  }
  cancelDeleteNote()
}

const cancelDeleteNote = () => {
  deleteDialog.value = {
    open: false,
    noteId: null,
    noteContent: '',
  }
}

// Patient edit handlers
const savePatientChanges = () => {
  // Update patient data
  patient.value = {
    ...patient.value,
    firstName: editPatientDialog.value.firstName,
    lastName: editPatientDialog.value.lastName,
    dateOfBirth: editPatientDialog.value.dateOfBirth, // Keep as string
    gender: editPatientDialog.value.gender,
    phone: editPatientDialog.value.phone,
    email: editPatientDialog.value.email,
    updatedAt: new Date().toISOString(),
  }

  cancelEditPatient()
}

const cancelEditPatient = () => {
  editPatientDialog.value = {
    open: false,
    firstName: '',
    lastName: '',
    dateOfBirth: '', // Reset to empty string
    gender: '',
    phone: '',
    email: '',
  }
}

// Form validation
const isPatientFormValid = computed(() => {
  return (
    editPatientDialog.value.firstName.trim() &&
    editPatientDialog.value.lastName.trim() &&
    editPatientDialog.value.dateOfBirth &&
    editPatientDialog.value.gender &&
    editPatientDialog.value.phone.trim() &&
    editPatientDialog.value.email.trim()
  )
})

// Load data on component mount
onMounted(() => {
  fetchPatientData()
})
</script>
