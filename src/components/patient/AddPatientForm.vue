<script setup lang="ts">
import { computed } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import DatePicker from '@/components/common/DatePicker.vue'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Gender, GENDER_OPTIONS } from '@/types/patient/gender'
import type { AddPatient } from '@/types/patient/patient'
import { useOverlay } from '@/composables/useApiCall'
import { useDialog } from '@/composables/useDialog'

const overlayState = useOverlay()
const { confirm, alert, error, success } = useDialog()

// Prevent dialog close when overlay is active
const canCloseDialog = computed(() => !overlayState.value.visible)

const testGenericDialog = () => {
  confirm({
    title: 'Delete Patient',
    message: 'Are you sure you want to delete this patient? This action cannot be undone.',
    acceptText: 'Delete',
    cancelText: 'Cancel',
    onAccept: () => {
      success({
        title: 'Success',
        message: 'Patient deleted successfully!',
      })
    },
    onCancel: () => {
      console.log('Delete cancelled')
    }
  })
}

// Zod validation schema matching AddPatient interface
const formSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),

  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),

  email: z
    .string()
    .email('Please enter a valid email address')
    .max(100, 'Email must not exceed 100 characters'),

  phoneNumber: z
    .string()
    .min(9, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must not exceed 15 digits')
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number'),

  dateOfBirth: z
    .date({
      required_error: 'Date of birth is required',
    })
    .refine((date) => {
      const today = new Date()
      const age = today.getFullYear() - date.getFullYear()
      return age >= 0 && age <= 120
    }, 'Please enter a valid date of birth'),

  gender: z.nativeEnum(Gender, {
    required_error: 'Please select a gender',
  }),
})

interface Emits {
  (e: 'save', patientData: AddPatient): void
}

const emit = defineEmits<Emits>()

// Form setup with vee-validate
const form = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: undefined,
    gender: undefined,
  },
})

// Form handlers
const resetForm = () => {
  form.resetForm({
    values: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: undefined,
      gender: undefined,
    },
  })
}

const onSubmit = form.handleSubmit((values) => {
  // Values already match AddPatient interface
  const patientData: AddPatient = {
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    phoneNumber: values.phoneNumber,
    dateOfBirth: values.dateOfBirth,
    gender: values.gender,
  }

  emit('save', patientData)
})

// Expose form methods for parent components
defineExpose({
  resetForm,
  canCloseDialog,
  submitForm: onSubmit,
  isValid: computed(() => form.meta.value.valid),
  isSubmitting: form.isSubmitting,
  testGenericDialog,
})
</script>

<template>
  <form @submit="onSubmit">
    <div class="grid gap-6">
      <!-- Name Fields -->
      <div class="grid grid-cols-2 gap-6">
        <FormField v-slot="{ componentField }" name="firstName">
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Enter first name" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="lastName">
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Enter last name" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <!-- Date and Gender -->
      <div class="grid grid-cols-2 gap-6">
        <FormField v-slot="{ field }" name="dateOfBirth">
          <FormItem>
            <FormLabel>Date of Birth</FormLabel>
            <FormControl>
              <DatePicker
                :model-value="field.value"
                @update:model-value="field.onChange"
                placeholder="Select date of birth..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="gender">
          <FormItem>
            <FormLabel>Gender</FormLabel>
            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem
                  v-for="option in GENDER_OPTIONS"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <!-- Contact Fields -->
      <div class="grid grid-cols-2 gap-6">
        <FormField v-slot="{ componentField }" name="phoneNumber">
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <Input type="tel" placeholder="Enter phone number" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="Enter email address" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

    </div>
  </form>
</template>
