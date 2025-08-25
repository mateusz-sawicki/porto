<script setup lang="ts">
import { ref, computed } from 'vue'
import DataTable from './DataTable.vue'
import { columns } from './columns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Users, UserCheck, UserX, RefreshCw, Database, Plus } from 'lucide-vue-next'
import { usePatients } from '@/composables/patient/usePatients'
import type { AddPatient } from '@/types/patient/patient'
import { Gender } from '@/types/patient/gender'

// Use patients composable
const {
  patients,
  stats,
  loading,
  error,
  refreshPatients,
  addPatient: createPatient,
} = usePatients()

// Add patient dialog state
const addPatientDialog = ref({
  open: false,
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: 0,
  phone: '',
  email: '',
})

// Add patient handlers
const addPatient = () => {
  addPatientDialog.value = {
    open: true,
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 0,
    phone: '',
    email: '',
  }
}

const saveNewPatient = async () => {
  // Create new patient object using AddPatient interface
  const newPatientData: AddPatient = {
    firstName: addPatientDialog.value.firstName,
    lastName: addPatientDialog.value.lastName,
    dateOfBirth: new Date(addPatientDialog.value.dateOfBirth),
    phoneNumber: addPatientDialog.value.phone,
    gender: addPatientDialog.value.gender as Gender,
    email: addPatientDialog.value.email,
  }

  try {
    const result = await createPatient(newPatientData)

    if (result) {
      // Success - patient was created
      cancelAddPatient()
      // No need to refresh - createPatient already updates the local array
    } else {
      // Handle error case
      console.error('Failed to add patient')
      // You might want to show a toast notification here
    }
  } catch (error) {
    console.error('Error adding patient:', error)
    // Handle error (show toast, etc.)
  }
}

const cancelAddPatient = () => {
  addPatientDialog.value = {
    open: false,
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 0,
    phone: '',
    email: '',
  }
}

// Form validation
const isAddPatientFormValid = computed(() => {
  return (
    addPatientDialog.value.firstName.trim() &&
    addPatientDialog.value.lastName.trim() &&
    addPatientDialog.value.dateOfBirth &&
    addPatientDialog.value.gender &&
    addPatientDialog.value.phone.trim() &&
    addPatientDialog.value.email.trim()
  )
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header with Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Patients</CardTitle>
          <Users class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.total }}</div>
          <p class="text-xs text-muted-foreground">{{ stats.filtered }} after filtering</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Active Patients</CardTitle>
          <UserCheck class="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-green-600">{{ stats.active }}</div>
          <p class="text-xs text-muted-foreground">
            {{ Math.round((stats.active / stats.total) * 100) }}% of total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Inactive Patients</CardTitle>
          <UserX class="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-red-600">{{ stats.inactive }}</div>
          <p class="text-xs text-muted-foreground">
            {{ Math.round((stats.inactive / stats.total) * 100) }}% of total
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- Data Table -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="flex items-center gap-2"> Patient Management </CardTitle>
            <CardDescription>
              Manage your dental practice patients with advanced filtering and sorting
            </CardDescription>
          </div>
          <div class="flex items-center gap-2">
            <Button @click="addPatient">
              <Plus class="h-4 w-4 mr-2" />
              Add Patient
            </Button>
            <Button variant="outline" size="sm" :disabled="loading" @click="refreshPatients">
              <RefreshCw class="h-4 w-4 mr-2" :class="{ 'animate-spin': loading }" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <!-- Error State -->
        <div v-if="error" class="text-center py-8">
          <div class="flex items-center justify-center text-red-600 mb-4">
            <span class="mr-2">⚠️</span>
            <span>{{ error }}</span>
          </div>
          <Button variant="outline" @click="refreshPatients"> Try Again </Button>
        </div>

        <!-- Loading State -->
        <div v-else-if="loading" class="text-center py-8">
          <div class="flex items-center justify-center">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span class="ml-2">Loading patients...</span>
          </div>
        </div>

        <!-- Data Table -->
        <DataTable v-else :columns="columns" :data="patients" />
      </CardContent>
    </Card>

    <!-- Add Patient Dialog -->
    <Dialog v-model:open="addPatientDialog.open">
      <DialogContent class="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2">
            <Plus class="w-5 h-5" />
            Add New Patient
          </DialogTitle>
        </DialogHeader>
        <div class="grid gap-6 py-6">
          <div class="grid grid-cols-2 gap-6">
            <div class="grid gap-2">
              <Label for="add-first-name">First Name</Label>
              <Input
                id="add-first-name"
                v-model="addPatientDialog.firstName"
                placeholder="Enter first name"
              />
            </div>
            <div class="grid gap-2">
              <Label for="add-last-name">Last Name</Label>
              <Input
                id="add-last-name"
                v-model="addPatientDialog.lastName"
                placeholder="Enter last name"
              />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-6">
            <div class="grid gap-2">
              <Label for="add-date-of-birth">Date of Birth</Label>
              <Input
                id="add-date-of-birth"
                type="date"
                v-model="addPatientDialog.dateOfBirth"
                class="w-full"
              />
            </div>
            <div class="grid gap-2">
              <Label for="add-gender">Gender</Label>
              <Select v-model="addPatientDialog.gender">
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
              <Label for="add-phone">Phone</Label>
              <Input
                id="add-phone"
                v-model="addPatientDialog.phone"
                placeholder="Enter phone number"
              />
            </div>
            <div class="grid gap-2">
              <Label for="add-email">Email</Label>
              <Input
                id="add-email"
                type="email"
                v-model="addPatientDialog.email"
                placeholder="Enter email address"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="cancelAddPatient"> Cancel </Button>
          <Button @click="saveNewPatient" :disabled="!isAddPatientFormValid"> Add Patient </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
