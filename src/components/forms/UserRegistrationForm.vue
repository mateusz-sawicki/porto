<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field } from 'vee-validate'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Mail, Phone, Calendar } from 'lucide-vue-next'

// Zod validation schema
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

  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must not exceed 15 digits')
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number'),

  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((date) => {
      const birthDate = new Date(date)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      return age >= 13 && age <= 120
    }, 'Age must be between 13 and 120 years'),

  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say'], {
    required_error: 'Please select a gender',
  }),

  country: z.string().min(1, 'Please select a country'),

  subscriptionPlan: z.enum(['basic', 'premium', 'enterprise'], {
    required_error: 'Please select a subscription plan',
  }),

  interests: z
    .array(z.string())
    .min(1, 'Please select at least one interest')
    .max(5, 'Please select no more than 5 interests'),

  termsAccepted: z
    .boolean()
    .refine((val) => val === true, 'You must accept the terms and conditions'),
})

type FormData = z.infer<typeof formSchema>

// Form setup with vee-validate
const { handleSubmit, errors, values, setFieldValue, setFieldTouched, validate, isSubmitting } = useForm<FormData>({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: undefined,
    country: '',
    subscriptionPlan: undefined,
    interests: [],
    termsAccepted: false,
  },
})

// Countries list (simplified)
const countries = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'au', label: 'Australia' },
  { value: 'br', label: 'Brazil' },
  { value: 'jp', label: 'Japan' },
]

// Interest options
const interestOptions = [
  {
    value: 'technology',
    label: 'Technology & Programming',
    description: 'Software development, AI, cybersecurity',
  },
  {
    value: 'design',
    label: 'Design & UX/UI',
    description: 'Web design, user experience, graphics',
  },
  {
    value: 'business',
    label: 'Business & Entrepreneurship',
    description: 'Startups, management, marketing',
  },
  { value: 'health', label: 'Health & Wellness', description: 'Fitness, nutrition, mental health' },
  {
    value: 'education',
    label: 'Education & Learning',
    description: 'Online courses, skill development',
  },
  {
    value: 'finance',
    label: 'Finance & Investment',
    description: 'Personal finance, trading, cryptocurrency',
  },
  {
    value: 'travel',
    label: 'Travel & Culture',
    description: 'Destinations, languages, cultural exchange',
  },
  {
    value: 'entertainment',
    label: 'Entertainment & Media',
    description: 'Movies, music, gaming, books',
  },
]

// Form submission handler
const onSubmit = handleSubmit(async (formData) => {
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log('Form submitted successfully:', formData)

    // Here you would typically make an API call
    // const response = await userRegistrationApi.create(formData)

    alert('Registration successful!')
  } catch (error) {
    console.error('Registration failed:', error)
    alert('Registration failed. Please try again.')
  }
})

// Helper function to get field error
const getFieldError = (fieldName: keyof FormData) => {
  return errors.value[fieldName]
}

// Helper function to check if field has error
const hasFieldError = (fieldName: keyof FormData) => {
  return !!errors.value[fieldName]
}

// No manual checkbox management needed - vee-validate handles it automatically
</script>

<template>
  <Card class="w-full max-w-2xl mx-auto">
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <User class="w-5 h-5" />
        User Registration
      </CardTitle>
      <CardDescription> Create your account by filling out the form below </CardDescription>
    </CardHeader>

    <CardContent>
      <form @submit="onSubmit" class="space-y-6">
        <!-- Personal Information -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium">Personal Information</h3>

          <!-- Name Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="firstName" :class="{ 'text-red-500': hasFieldError('firstName') }">
                First Name *
              </Label>
              <Input
                id="firstName"
                v-model="values.firstName"
                :class="{ 'border-red-500': hasFieldError('firstName') }"
                placeholder="Enter your first name"
                @update:model-value="
                  (value: string | number) => setFieldValue('firstName', String(value))
                "
              />
              <p v-if="getFieldError('firstName')" class="text-sm text-red-500">
                {{ getFieldError('firstName') }}
              </p>
            </div>

            <div class="space-y-2">
              <Label for="lastName" :class="{ 'text-red-500': hasFieldError('lastName') }">
                Last Name *
              </Label>
              <Input
                id="lastName"
                v-model="values.lastName"
                :class="{ 'border-red-500': hasFieldError('lastName') }"
                placeholder="Enter your last name"
                @update:model-value="
                  (value: string | number) => setFieldValue('lastName', String(value))
                "
              />
              <p v-if="getFieldError('lastName')" class="text-sm text-red-500">
                {{ getFieldError('lastName') }}
              </p>
            </div>
          </div>

          <!-- Date of Birth and Gender -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="dateOfBirth" :class="{ 'text-red-500': hasFieldError('dateOfBirth') }">
                <Calendar class="w-4 h-4 inline mr-1" />
                Date of Birth *
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                v-model="values.dateOfBirth"
                :class="{ 'border-red-500': hasFieldError('dateOfBirth') }"
                @update:model-value="
                  (value: string | number) => setFieldValue('dateOfBirth', String(value))
                "
              />
              <p v-if="getFieldError('dateOfBirth')" class="text-sm text-red-500">
                {{ getFieldError('dateOfBirth') }}
              </p>
            </div>

            <div class="space-y-2">
              <Label for="gender" :class="{ 'text-red-500': hasFieldError('gender') }">
                Gender *
              </Label>
              <Select
                v-model="values.gender"
                @update:model-value="
                  (value: any) => setFieldValue('gender', value as FormData['gender'])
                "
              >
                <SelectTrigger :class="{ 'border-red-500': hasFieldError('gender') }">
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
              <p v-if="getFieldError('gender')" class="text-sm text-red-500">
                {{ getFieldError('gender') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium">Contact Information</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="email" :class="{ 'text-red-500': hasFieldError('email') }">
                <Mail class="w-4 h-4 inline mr-1" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                v-model="values.email"
                :class="{ 'border-red-500': hasFieldError('email') }"
                placeholder="Enter your email"
                @update:model-value="
                  (value: string | number) => setFieldValue('email', String(value))
                "
              />
              <p v-if="getFieldError('email')" class="text-sm text-red-500">
                {{ getFieldError('email') }}
              </p>
            </div>

            <div class="space-y-2">
              <Label for="phone" :class="{ 'text-red-500': hasFieldError('phone') }">
                <Phone class="w-4 h-4 inline mr-1" />
                Phone Number *
              </Label>
              <Input
                id="phone"
                v-model="values.phone"
                :class="{ 'border-red-500': hasFieldError('phone') }"
                placeholder="Enter your phone number"
                @update:model-value="
                  (value: string | number) => setFieldValue('phone', String(value))
                "
              />
              <p v-if="getFieldError('phone')" class="text-sm text-red-500">
                {{ getFieldError('phone') }}
              </p>
            </div>
          </div>

          <!-- Country -->
          <div class="space-y-2">
            <Label for="country" :class="{ 'text-red-500': hasFieldError('country') }">
              Country *
            </Label>
            <Select
              v-model="values.country"
              @update:model-value="(value: any) => setFieldValue('country', String(value))"
            >
              <SelectTrigger :class="{ 'border-red-500': hasFieldError('country') }">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="country in countries"
                  :key="country.value"
                  :value="country.value"
                >
                  {{ country.label }}
                </SelectItem>
              </SelectContent>
            </Select>
            <p v-if="getFieldError('country')" class="text-sm text-red-500">
              {{ getFieldError('country') }}
            </p>
          </div>
        </div>

        <!-- Subscription Plan -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium">Subscription Plan</h3>

          <div class="space-y-2">
            <Label :class="{ 'text-red-500': hasFieldError('subscriptionPlan') }">
              Choose your plan *
            </Label>
            <RadioGroup
              v-model="values.subscriptionPlan"
              @update:model-value="
                (value: any) =>
                  setFieldValue('subscriptionPlan', value as FormData['subscriptionPlan'])
              "
              class="space-y-3"
            >
              <div
                class="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <RadioGroupItem value="basic" id="basic" class="mt-1" />
                <div class="flex-1 space-y-1">
                  <Label for="basic" class="font-medium cursor-pointer"> Basic Plan - Free </Label>
                  <p class="text-sm text-slate-600 dark:text-slate-400">
                    Essential features for getting started. Perfect for personal use.
                  </p>
                  <ul
                    class="text-xs text-slate-500 dark:text-slate-500 list-disc list-inside space-y-1"
                  >
                    <li>Up to 5 projects</li>
                    <li>Basic support</li>
                    <li>1GB storage</li>
                  </ul>
                </div>
              </div>

              <div
                class="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <RadioGroupItem value="premium" id="premium" class="mt-1" />
                <div class="flex-1 space-y-1">
                  <Label for="premium" class="font-medium cursor-pointer">
                    Premium Plan - $9.99/month
                  </Label>
                  <p class="text-sm text-slate-600 dark:text-slate-400">
                    Advanced features for professionals and growing teams.
                  </p>
                  <ul
                    class="text-xs text-slate-500 dark:text-slate-500 list-disc list-inside space-y-1"
                  >
                    <li>Unlimited projects</li>
                    <li>Priority support</li>
                    <li>50GB storage</li>
                    <li>Advanced analytics</li>
                  </ul>
                </div>
              </div>

              <div
                class="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <RadioGroupItem value="enterprise" id="enterprise" class="mt-1" />
                <div class="flex-1 space-y-1">
                  <Label for="enterprise" class="font-medium cursor-pointer">
                    Enterprise Plan - Contact us
                  </Label>
                  <p class="text-sm text-slate-600 dark:text-slate-400">
                    Custom solutions for large organizations with specific needs.
                  </p>
                  <ul
                    class="text-xs text-slate-500 dark:text-slate-500 list-disc list-inside space-y-1"
                  >
                    <li>Custom integrations</li>
                    <li>Dedicated support</li>
                    <li>Unlimited storage</li>
                    <li>Advanced security</li>
                  </ul>
                </div>
              </div>
            </RadioGroup>
            <p v-if="getFieldError('subscriptionPlan')" class="text-sm text-red-500">
              {{ getFieldError('subscriptionPlan') }}
            </p>
          </div>
        </div>

        <!-- Interests -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium">Interests & Preferences</h3>

          <div class="space-y-2">
            <Label :class="{ 'text-red-500': hasFieldError('interests') }">
              Select your interests (1-5 selections) *
            </Label>
            <p class="text-sm text-slate-600 dark:text-slate-400">
              Help us personalize your experience by selecting topics that interest you.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div
                v-for="interest in interestOptions"
                :key="interest.value"
                class="flex items-start space-x-3 p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Field
                  name="interests"
                  type="checkbox"
                  :value="interest.value"
                  v-slot="{ field }"
                >
                  <input
                    v-bind="field"
                    type="checkbox"
                    :id="interest.value"
                    :value="interest.value"
                    class="mt-1 h-4 w-4 rounded border border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                  />
                </Field>
                <div class="flex-1 space-y-1">
                  <Label :for="interest.value" class="font-medium cursor-pointer text-sm">
                    {{ interest.label }}
                  </Label>
                  <p class="text-xs text-slate-500 dark:text-slate-400">
                    {{ interest.description }}
                  </p>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between text-sm mt-2">
              <p v-if="getFieldError('interests')" class="text-red-500">
                {{ getFieldError('interests') }}
              </p>
              <p v-else class="text-slate-500 dark:text-slate-400">
                Selected: {{ Array.isArray(values.interests) ? values.interests.length : 0 }}/5
              </p>
            </div>
          </div>
        </div>

        <!-- Terms and Conditions -->
        <div class="space-y-4">
          <div class="flex items-start space-x-2">
            <input
              id="termsAccepted"
              type="checkbox"
              v-model="values.termsAccepted"
              :class="{ 'border-red-500': hasFieldError('termsAccepted') }"
              class="mt-1"
              @change="setFieldValue('termsAccepted', ($event.target as HTMLInputElement).checked)"
            />
            <div class="space-y-1">
              <Label
                for="termsAccepted"
                :class="{ 'text-red-500': hasFieldError('termsAccepted') }"
                class="text-sm font-normal cursor-pointer"
              >
                I accept the
                <a href="#" class="text-blue-600 hover:underline">Terms and Conditions</a> and
                <a href="#" class="text-blue-600 hover:underline">Privacy Policy</a> *
              </Label>
              <p v-if="getFieldError('termsAccepted')" class="text-sm text-red-500">
                {{ getFieldError('termsAccepted') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="pt-4">
          <Button type="submit" :disabled="isSubmitting" class="w-full md:w-auto">
            <span v-if="isSubmitting">Registering...</span>
            <span v-else>Register Account</span>
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template>
