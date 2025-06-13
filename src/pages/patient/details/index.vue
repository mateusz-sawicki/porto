<template>
  <div class="container mx-auto p-6 space-y-6">
    <!-- Patient Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">{{ patient.firstName }} {{ patient.lastName }}</h1>
        <p class="text-muted-foreground">Patient ID: {{ patient.id }}</p>
      </div>
      <Button @click="editPatient" variant="outline">
        <Edit class="w-4 h-4 mr-2" />
        Edit Patient
      </Button>
    </div>

    <!-- Patient Information Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <div>
            <Label class="text-sm font-medium">Address</Label>
            <p class="text-sm">{{ patient.address }}</p>
          </div>
        </CardContent>
      </Card>

      <!-- Medical Information -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <Heart class="w-5 h-5 mr-2" />
            Medical Information
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-2">
          <div>
            <Label class="text-sm font-medium">Insurance</Label>
            <p class="text-sm">{{ patient.insurance }}</p>
          </div>
          <div>
            <Label class="text-sm font-medium">Emergency Contact</Label>
            <p class="text-sm">{{ patient.emergencyContact }}</p>
          </div>
          <div>
            <Label class="text-sm font-medium">Allergies</Label>
            <p class="text-sm">{{ patient.allergies || 'None reported' }}</p>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Treatment Plans Section -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle class="flex items-center">
            <FileText class="w-5 h-5 mr-2" />
            Treatment Plans
          </CardTitle>
          <Button @click="createTreatmentPlan">
            <Plus class="w-4 h-4 mr-2" />
            New Treatment Plan
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <!-- Treatment Plans Table -->
        <div class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="plan in treatmentPlans" :key="plan.id">
                <TableCell class="font-medium">{{ plan.name }}</TableCell>
                <TableCell>{{ plan.condition }}</TableCell>
                <TableCell>{{ formatDate(plan.startDate) }}</TableCell>
                <TableCell>
                  <Badge :variant="getStatusVariant(plan.status)">
                    {{ plan.status }}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div class="flex items-center space-x-2">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-blue-600 h-2 rounded-full"
                        :style="{ width: plan.progress + '%' }"
                      ></div>
                    </div>
                    <span class="text-sm text-muted-foreground">{{ plan.progress }}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div class="flex items-center space-x-2">
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
        <div v-if="treatmentPlans.length === 0" class="text-center py-8">
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { User, Phone, Heart, FileText, Plus, Edit, Eye, Trash2 } from 'lucide-vue-next'

// Sample patient data
const patient = ref({
  id: 'P-2024-001',
  firstName: 'Sarah',
  lastName: 'Johnson',
  dateOfBirth: '1985-03-15',
  gender: 'Female',
  phone: '+1 (555) 123-4567',
  email: 'sarah.johnson@email.com',
  address: '123 Main St, Springfield, IL 62701',
  insurance: 'Blue Cross Blue Shield',
  emergencyContact: 'John Johnson - (555) 987-6543',
  allergies: 'Penicillin, Shellfish',
})

// Sample treatment plans data
const treatmentPlans = ref([
  {
    id: 1,
    name: 'Post-Surgery Recovery',
    condition: 'Knee Replacement Recovery',
    startDate: '2024-01-15',
    status: 'Active',
    progress: 75,
  },
  {
    id: 2,
    name: 'Physical Therapy',
    condition: 'Lower Back Pain',
    startDate: '2024-02-01',
    status: 'Active',
    progress: 45,
  },
  {
    id: 3,
    name: 'Diabetes Management',
    condition: 'Type 2 Diabetes',
    startDate: '2023-11-20',
    status: 'Completed',
    progress: 100,
  },
  {
    id: 4,
    name: 'Hypertension Control',
    condition: 'High Blood Pressure',
    startDate: '2024-03-10',
    status: 'On Hold',
    progress: 20,
  },
])

// Helper functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
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
  console.log('Edit patient:', patient.value.id)
  // Navigate to edit patient form
}

const createTreatmentPlan = () => {
  console.log('Create new treatment plan for patient:', patient.value.id)
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
</script>
