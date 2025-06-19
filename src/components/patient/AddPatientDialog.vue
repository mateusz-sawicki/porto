<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Button } from '@/components/ui/button'
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
import { Plus } from 'lucide-vue-next'

interface Props {
  open: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'save', patientData: PatientFormData): void
}

interface PatientFormData {
  name: string
  surname: string
  isActive: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Form state
const formData = ref({
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  phone: '',
  email: '',
})

// Reset form when dialog opens
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      resetForm()
    }
  },
)

// Form validation
const isFormValid = computed(() => {
  return (
    formData.value.firstName.trim() &&
    formData.value.lastName.trim() &&
    formData.value.dateOfBirth &&
    formData.value.gender &&
    formData.value.phone.trim() &&
    formData.value.email.trim()
  )
})

// Form handlers
const resetForm = () => {
  formData.value = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    email: '',
  }
}

const handleClose = () => {
  emit('close')
}

const handleSave = () => {
  if (!isFormValid.value) return

  // Transform form data to match Patient interface
  const patientData: PatientFormData = {
    name: formData.value.firstName,
    surname: formData.value.lastName,
    isActive: true, // Default to active
  }

  emit('save', patientData)
}

// Handle dialog open/close state
const dialogOpen = computed({
  get: () => props.open,
  set: (value) => {
    if (!value) {
      emit('close')
    }
  },
})
</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <DialogContent class="sm:max-w-[800px]">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Plus class="w-5 h-5" />
          Add New Patient
        </DialogTitle>
      </DialogHeader>

      <div class="grid gap-6 py-6">
        <!-- Name Fields -->
        <div class="grid grid-cols-2 gap-6">
          <div class="grid gap-2">
            <Label for="add-first-name">First Name</Label>
            <Input
              id="add-first-name"
              v-model="formData.firstName"
              placeholder="Enter first name"
            />
          </div>
          <div class="grid gap-2">
            <Label for="add-last-name">Last Name</Label>
            <Input id="add-last-name" v-model="formData.lastName" placeholder="Enter last name" />
          </div>
        </div>

        <!-- Date and Gender -->
        <div class="grid grid-cols-2 gap-6">
          <div class="grid gap-2">
            <Label for="add-date-of-birth">Date of Birth</Label>
            <Input
              id="add-date-of-birth"
              type="date"
              v-model="formData.dateOfBirth"
              class="w-full"
            />
          </div>
          <div class="grid gap-2">
            <Label for="add-gender">Gender</Label>
            <Select v-model="formData.gender">
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

        <!-- Contact Fields -->
        <div class="grid grid-cols-2 gap-6">
          <div class="grid gap-2">
            <Label for="add-phone">Phone</Label>
            <Input id="add-phone" v-model="formData.phone" placeholder="Enter phone number" />
          </div>
          <div class="grid gap-2">
            <Label for="add-email">Email</Label>
            <Input
              id="add-email"
              type="email"
              v-model="formData.email"
              placeholder="Enter email address"
            />
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="handleClose"> Cancel </Button>
        <Button @click="handleSave" :disabled="!isFormValid"> Add Patient </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
