<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold mb-2">Create Treatment Plan</h1>
            <p class="text-muted-foreground">
              Follow the steps to create a comprehensive treatment plan
            </p>
          </div>

          <div class="flex items-center gap-3">
            <div v-if="lastSaved" class="text-sm text-gray-500">
              Last saved: {{ lastSaved.toLocaleTimeString() }}
            </div>
            <Button @click="saveTreatmentPlan" :disabled="isSaving" class="flex items-center gap-2">
              <CheckCircle class="w-4 h-4" />
              {{ isSaving ? 'Saving...' : 'Save Treatment Plan' }}
            </Button>
          </div>
        </div>
      </div>

      <!-- Stepper -->
      <div class="mb-8">
        <div class="flex items-start w-full">
          <div
            v-for="(step, index) in steps"
            :key="step.id"
            class="flex flex-col items-center flex-1 relative"
          >
            <!-- Step circle -->
            <button
              @click="goToStep(step.id)"
              :disabled="isLoading"
              :class="[
                'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors mb-4 relative z-10',
                currentStep >= step.id
                  ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'border-muted-foreground/20 bg-background text-muted-foreground hover:border-primary/50 hover:text-primary',
                isLoading ? 'cursor-wait' : 'cursor-pointer',
              ]"
            >
              <CheckCircle v-if="currentStep > step.id" class="h-4 w-4" />
              <component v-else :is="step.icon" class="h-4 w-4" />
            </button>

            <!-- Connector line -->
            <div
              v-if="index < steps.length - 1"
              :class="[
                'absolute top-5 left-1/2 h-0.5 w-full z-0',
                currentStep > step.id ? 'bg-primary' : 'bg-muted',
              ]"
            />

            <!-- Step labels -->
            <div class="text-center">
              <div
                :class="[
                  'text-sm font-medium',
                  currentStep >= step.id ? 'text-primary' : 'text-muted-foreground',
                ]"
              >
                {{ step.title }}
              </div>
              <div
                :class="[
                  'text-xs mt-1',
                  currentStep >= step.id ? 'text-primary/70' : 'text-muted-foreground/70',
                ]"
              >
                Step {{ step.id }} of {{ steps.length }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- jeżeli nie w assesments to w podsumowaniu nie wyświetlamy pola (backend) -->
      <!-- Main Content -->
      <Card class="mb-8">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <component :is="steps[currentStep - 1].icon" class="w-6 h-6" />
            Step {{ currentStep }}: {{ steps[currentStep - 1].title }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <!-- Step 1: Basic Information -->
          <div v-if="currentStep === 1" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label for="planName">Treatment Plan Name</Label>
                <Input id="planName" v-model="formData.planName" placeholder="Enter plan name" />
              </div>

              <div class="space-y-2">
                <Label for="patientType">Patient Type</Label>
                <Select v-model="formData.patientType">
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="adult">Adult</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="elderly">Elderly</SelectItem>
                    <SelectItem value="special-needs">Special Needs</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="space-y-2">
                <Label for="treatmentCategory">Treatment Category</Label>
                <Select v-model="formData.treatmentCategory">
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physical-therapy">Physical Therapy</SelectItem>
                    <SelectItem value="medication">Medication</SelectItem>
                    <SelectItem value="surgery">Surgery</SelectItem>
                    <SelectItem value="rehabilitation">Rehabilitation</SelectItem>
                    <SelectItem value="prevention">Prevention</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="space-y-2">
                <Label for="priority">Priority Level</Label>
                <Select v-model="formData.priority">
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="space-y-2">
                <Label for="estimatedDuration">Estimated Duration</Label>
                <Select v-model="formData.estimatedDuration">
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-week">1 Week</SelectItem>
                    <SelectItem value="2-weeks">2 Weeks</SelectItem>
                    <SelectItem value="1-month">1 Month</SelectItem>
                    <SelectItem value="3-months">3 Months</SelectItem>
                    <SelectItem value="6-months">6 Months</SelectItem>
                    <SelectItem value="1-year">1 Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="space-y-2">
                <Label for="assignedProvider">Assigned Provider</Label>
                <Select v-model="formData.assignedProvider">
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dr-smith">Dr. Smith (Orthopedics)</SelectItem>
                    <SelectItem value="dr-johnson">Dr. Johnson (Cardiology)</SelectItem>
                    <SelectItem value="sarah-williams">Sarah Williams, PT</SelectItem>
                    <SelectItem value="dr-brown">Dr. Brown (General Medicine)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div class="space-y-2">
              <Label for="description">Treatment Description</Label>
              <Textarea
                id="description"
                v-model="formData.description"
                placeholder="Provide detailed description of the treatment plan..."
                class="min-h-[120px]"
              />
            </div>
          </div>

          <!-- Step 2: Odontogram -->
          <div v-else-if="currentStep === 2" class="space-y-6">
            <div class="text-center mb-6">
              <h3 class="text-2xl font-bold mb-2">Odontogram</h3>
              <p class="text-muted-foreground">Dental chart will be implemented here</p>
            </div>

            <Card class="min-h-[400px] flex items-center justify-center">
              <div class="text-center space-y-4">
                <User class="w-16 h-16 mx-auto text-gray-400" />
                <div>
                  <Odontogram />
                </div>
              </div>
            </Card>
          </div>

          <!-- Step 3: Measurements -->
          <div v-else-if="currentStep === 3" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div class="space-y-2">
                <Label for="dosage">Dosage (mg)</Label>
                <Input
                  id="dosage"
                  type="number"
                  v-model="formData.dosage"
                  placeholder="Enter dosage"
                />
              </div>

              <div class="space-y-2">
                <Label for="frequency">Frequency (per day)</Label>
                <Input
                  id="frequency"
                  type="number"
                  v-model="formData.frequency"
                  placeholder="Times per day"
                />
              </div>

              <div class="space-y-2">
                <Label for="duration">Duration (days)</Label>
                <Input
                  id="duration"
                  type="number"
                  v-model="formData.duration"
                  placeholder="Treatment duration"
                />
              </div>

              <div class="space-y-2">
                <Label for="weight">Patient Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  v-model="formData.weight"
                  placeholder="Weight in kg"
                />
              </div>

              <div class="space-y-2">
                <Label for="height">Patient Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  v-model="formData.height"
                  placeholder="Height in cm"
                />
              </div>

              <div class="space-y-2">
                <Label for="targetValue">Target Value</Label>
                <Input
                  id="targetValue"
                  type="number"
                  step="0.1"
                  v-model="formData.targetValue"
                  placeholder="Target measurement"
                />
              </div>

              <div class="space-y-2">
                <Label for="currentValue">Current Value</Label>
                <Input
                  id="currentValue"
                  type="number"
                  step="0.1"
                  v-model="formData.currentValue"
                  placeholder="Current measurement"
                />
              </div>

              <div class="space-y-2">
                <Label for="maximumValue">Maximum Value</Label>
                <Input
                  id="maximumValue"
                  type="number"
                  step="0.1"
                  v-model="formData.maximumValue"
                  placeholder="Maximum allowed"
                />
              </div>
            </div>
          </div>

          <!-- Step 4: Assessment -->
          <div v-else-if="currentStep === 4" class="space-y-8">
            <div
              v-for="question in assessmentQuestions"
              :key="question.key"
              class="space-y-4 p-4 border rounded-lg"
            >
              <Label class="text-base font-medium">{{ question.text }}</Label>
              <div class="flex space-x-6">
                <div class="flex items-center space-x-2">
                  <input
                    type="radio"
                    :id="`${question.key}-yes`"
                    :name="question.key"
                    value="yes"
                    v-model="formData[question.key as keyof FormData]"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  />
                  <Label :for="`${question.key}-yes`" class="cursor-pointer">Yes</Label>
                </div>
                <div class="flex items-center space-x-2">
                  <input
                    type="radio"
                    :id="`${question.key}-no`"
                    :name="question.key"
                    value="no"
                    v-model="formData[question.key as keyof FormData]"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  />
                  <Label :for="`${question.key}-no`" class="cursor-pointer">No</Label>
                </div>
              </div>

              <div v-if="formData[question.key as keyof FormData] === 'yes'" class="space-y-2 mt-4">
                <Label :for="`${question.key}-details`">Please provide details:</Label>
                <Textarea
                  :id="`${question.key}-details`"
                  v-model="formData[`${question.key}Details` as keyof FormData]"
                  placeholder="Enter additional details..."
                  class="min-h-[80px]"
                />
              </div>
            </div>
          </div>

          <!-- Step 5: Documents -->
          <div v-else-if="currentStep === 5" class="space-y-6">
            <div class="text-center mb-6">
              <h3 class="text-2xl font-bold mb-2">Document Upload</h3>
              <p class="text-muted-foreground">Upload relevant medical documents and images</p>
            </div>

            <div class="space-y-4">
              <!-- Medical Reports Section -->
              <div class="border rounded-lg">
                <button
                  @click="toggleAccordion('medicalReports')"
                  class="w-full flex items-center justify-between p-4 text-left font-semibold hover:bg-gray-50"
                >
                  <span class="text-lg">Medical Reports & Documents</span>
                  <ChevronRight
                    :class="[
                      'w-5 h-5 transition-transform',
                      accordionOpen.medicalReports ? 'rotate-90' : '',
                    ]"
                  />
                </button>
                <div v-if="accordionOpen.medicalReports" class="p-4 border-t">
                  <div class="space-y-4">
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload class="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p class="text-sm text-gray-600 mb-2">
                        Drag and drop files here, or click to browse
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        @change="
                          (e: Event) =>
                            handleFileUpload('medicalReports', (e.target as HTMLInputElement).files)
                        "
                        class="hidden"
                        id="upload-medicalReports"
                      />
                      <label for="upload-medicalReports">
                        <Button variant="outline" class="cursor-pointer"> Choose Files </Button>
                      </label>
                    </div>

                    <div v-if="uploadedFiles.medicalReports.length > 0" class="space-y-2">
                      <Label class="text-sm font-medium">Uploaded Files:</Label>
                      <div
                        v-for="(file, index) in uploadedFiles.medicalReports"
                        :key="index"
                        class="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <span class="text-sm truncate">{{ file.name }}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          @click="removeFile('medicalReports', index)"
                        >
                          <X class="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Treatment Images Section -->
              <div class="border rounded-lg">
                <button
                  @click="toggleAccordion('treatmentImages')"
                  class="w-full flex items-center justify-between p-4 text-left font-semibold hover:bg-gray-50"
                >
                  <span class="text-lg">Treatment Images & Scans</span>
                  <ChevronRight
                    :class="[
                      'w-5 h-5 transition-transform',
                      accordionOpen.treatmentImages ? 'rotate-90' : '',
                    ]"
                  />
                </button>
                <div v-if="accordionOpen.treatmentImages" class="p-4 border-t">
                  <div class="space-y-4">
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload class="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p class="text-sm text-gray-600 mb-2">
                        Drag and drop files here, or click to browse
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        @change="
                          (e: Event) =>
                            handleFileUpload(
                              'treatmentImages',
                              (e.target as HTMLInputElement).files,
                            )
                        "
                        class="hidden"
                        id="upload-treatmentImages"
                      />
                      <label for="upload-treatmentImages">
                        <Button variant="outline" class="cursor-pointer"> Choose Files </Button>
                      </label>
                    </div>

                    <div v-if="uploadedFiles.treatmentImages.length > 0" class="space-y-2">
                      <Label class="text-sm font-medium">Uploaded Files:</Label>
                      <div
                        v-for="(file, index) in uploadedFiles.treatmentImages"
                        :key="index"
                        class="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <span class="text-sm truncate">{{ file.name }}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          @click="removeFile('treatmentImages', index)"
                        >
                          <X class="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 6: Review -->
          <div v-else-if="currentStep === 6" class="space-y-8">
            <div class="text-center mb-6">
              <h3 class="text-2xl font-bold mb-2">Treatment Plan Summary</h3>
              <p class="text-muted-foreground">Review all information before proceeding</p>
            </div>

            <!-- Basic Information Summary -->
            <Card>
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <FileText class="w-5 h-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label class="text-sm font-medium text-muted-foreground">Plan Name</Label>
                    <p class="font-medium">{{ formData.planName || 'Not specified' }}</p>
                  </div>
                  <div>
                    <Label class="text-sm font-medium text-muted-foreground">Patient Type</Label>
                    <p class="font-medium capitalize">
                      {{ formData.patientType || 'Not specified' }}
                    </p>
                  </div>
                  <div>
                    <Label class="text-sm font-medium text-muted-foreground">Category</Label>
                    <p class="font-medium capitalize">
                      {{ formData.treatmentCategory?.replace('-', ' ') || 'Not specified' }}
                    </p>
                  </div>
                  <div>
                    <Label class="text-sm font-medium text-muted-foreground">Priority</Label>
                    <Badge :variant="getPriorityVariant(formData.priority)">
                      {{ formData.priority || 'Not specified' }}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label class="text-sm font-medium text-muted-foreground">Description</Label>
                  <p class="mt-1">{{ formData.description || 'No description provided' }}</p>
                </div>
              </CardContent>
            </Card>

            <!-- Odontogram Summary -->
            <Card>
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <User class="w-5 h-5" />
                  Odontogram
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p class="text-muted-foreground">
                  Dental chart data will be displayed here when implemented
                </p>
              </CardContent>
            </Card>

            <!-- Measurements Summary -->
            <Card>
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <Calculator class="w-5 h-5" />
                  Measurements & Values
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div v-for="item in measurementItems" :key="item.label">
                    <Label class="text-sm font-medium text-muted-foreground">{{
                      item.label
                    }}</Label>
                    <p class="font-medium">
                      {{ item.value ? `${item.value} ${item.unit}` : 'Not specified' }}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Assessment Summary -->
            <Card>
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <HelpCircle class="w-5 h-5" />
                  Assessment Questions
                </CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <div
                  v-for="question in assessmentQuestions"
                  :key="question.key"
                  class="border-l-4 border-blue-500 pl-4"
                >
                  <p class="font-medium">{{ question.text }}</p>
                  <p class="text-muted-foreground capitalize">
                    {{ formData[question.key as keyof FormData] || 'Not answered' }}
                  </p>
                  <p
                    v-if="
                      formData[question.key as keyof FormData] === 'yes' &&
                      formData[`${question.key}Details` as keyof FormData]
                    "
                    class="mt-2 text-sm bg-gray-50 p-2 rounded"
                  >
                    {{ formData[`${question.key}Details` as keyof FormData] }}
                  </p>
                </div>
              </CardContent>
            </Card>

            <!-- Documents Summary -->
            <Card>
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <Camera class="w-5 h-5" />
                  Uploaded Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div class="space-y-4">
                  <div>
                    <Label class="text-sm font-medium text-muted-foreground">Medical Reports</Label>
                    <p class="font-medium">
                      {{ uploadedFiles.medicalReports.length }} files uploaded
                    </p>
                  </div>
                  <div>
                    <Label class="text-sm font-medium text-muted-foreground"
                      >Treatment Images</Label
                    >
                    <p class="font-medium">
                      {{ uploadedFiles.treatmentImages.length }} files uploaded
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <!-- Navigation -->
      <div class="flex justify-between">
        <Button
          variant="outline"
          @click="prevStep"
          :disabled="currentStep === 1 || isLoading"
          class="flex items-center gap-2"
        >
          <ChevronLeft class="w-4 h-4" />
          Previous
        </Button>

        <div class="flex items-center gap-2">
          <Button @click="saveProgress" :disabled="isLoading" variant="outline" size="sm">
            <Save class="w-4 h-4 mr-2" />
            {{ isLoading ? 'Saving...' : 'Save Progress' }}
          </Button>

          <Button
            v-if="currentStep < steps.length"
            @click="nextStep"
            :disabled="isLoading"
            class="flex items-center gap-2"
          >
            Next
            <ChevronRight class="w-4 h-4" />
          </Button>
          <Button v-else @click="createTreatmentPlan" class="flex items-center gap-2">
            <CheckCircle class="w-4 h-4" />
            Create Treatment Plan
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  CheckCircle,
  FileText,
  User,
  Calculator,
  HelpCircle,
  FileCheck,
  Camera,
  Save,
} from 'lucide-vue-next'
import Odontogram from '@/components/odontogram/Odontogram.vue'

// Types
interface FormData {
  planName: string
  patientType: string
  treatmentCategory: string
  priority: string
  estimatedDuration: string
  assignedProvider: string
  description: string
  dosage: string
  frequency: string
  duration: string
  weight: string
  height: string
  targetValue: string
  currentValue: string
  maximumValue: string
  question1: string
  question1Details: string
  question2: string
  question2Details: string
  question3: string
  question3Details: string
  question4: string
  question4Details: string
}

interface Step {
  id: number
  title: string
  icon: any
}

interface AssessmentQuestion {
  key: keyof FormData
  text: string
}

interface MeasurementItem {
  label: string
  value: string
  unit: string
}

// Reactive state
const currentStep = ref(1)
const isLoading = ref(false)
const isSaving = ref(false)
const lastSaved = ref<Date | null>(null)

const formData = ref<FormData>({
  planName: '',
  patientType: '',
  treatmentCategory: '',
  priority: '',
  estimatedDuration: '',
  assignedProvider: '',
  description: '',
  dosage: '',
  frequency: '',
  duration: '',
  weight: '',
  height: '',
  targetValue: '',
  currentValue: '',
  maximumValue: '',
  question1: '',
  question1Details: '',
  question2: '',
  question2Details: '',
  question3: '',
  question3Details: '',
  question4: '',
  question4Details: '',
})

const uploadedFiles = ref({
  medicalReports: [] as File[],
  treatmentImages: [] as File[],
})

const accordionOpen = ref<Record<string, boolean>>({
  medicalReports: false,
  treatmentImages: false,
})

// Static data
const steps: Step[] = [
  { id: 1, title: 'Basic Information', icon: FileText },
  { id: 2, title: 'Odontogram', icon: User },
  { id: 3, title: 'Measurements', icon: Calculator },
  { id: 4, title: 'Assessment', icon: HelpCircle },
  { id: 5, title: 'Documents', icon: Camera },
  { id: 6, title: 'Review', icon: FileCheck },
]

const assessmentQuestions: AssessmentQuestion[] = [
  { key: 'question1', text: 'Does the patient have any allergies?' },
  { key: 'question2', text: 'Is the patient currently taking other medications?' },
  { key: 'question3', text: 'Has the patient undergone similar treatment before?' },
  { key: 'question4', text: 'Are there any mobility restrictions?' },
]

// Mock API functions
const mockApi = {
  async saveProgress(
    stepNumber: number,
    stepData: any,
  ): Promise<{ success: boolean; savedAt: string }> {
    await new Promise((resolve) => setTimeout(resolve, 800))
    console.log(`Saving progress for step ${stepNumber}:`, stepData)
    return {
      success: true,
      savedAt: new Date().toISOString(),
    }
  },

  async saveTreatmentPlan(
    planData: FormData,
  ): Promise<{ success: boolean; planId: string; savedAt: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1200))
    console.log('Saving complete treatment plan:', planData)
    return {
      success: true,
      planId: `tp-${Date.now()}`,
      savedAt: new Date().toISOString(),
    }
  },
}

// Computed
const measurementItems = computed((): MeasurementItem[] => [
  { label: 'Dosage', value: formData.value.dosage, unit: 'mg' },
  { label: 'Frequency', value: formData.value.frequency, unit: '/day' },
  { label: 'Duration', value: formData.value.duration, unit: 'days' },
  { label: 'Weight', value: formData.value.weight, unit: 'kg' },
  { label: 'Height', value: formData.value.height, unit: 'cm' },
  { label: 'Target Value', value: formData.value.targetValue, unit: '' },
  { label: 'Current Value', value: formData.value.currentValue, unit: '' },
  { label: 'Maximum Value', value: formData.value.maximumValue, unit: '' },
])

// Methods
const goToStep = async (stepNumber: number) => {
  if (
    stepNumber < 1 ||
    stepNumber > steps.length ||
    isLoading.value ||
    stepNumber === currentStep.value
  )
    return

  // Save current progress before switching
  await saveProgress()
  currentStep.value = stepNumber
}

const nextStep = async () => {
  if (currentStep.value < steps.length && !isLoading.value) {
    await saveProgress() // Auto-save when moving to next step
    currentStep.value++
  }
}

const prevStep = async () => {
  if (currentStep.value > 1 && !isLoading.value) {
    await saveProgress() // Auto-save when moving to previous step
    currentStep.value--
  }
}

const saveProgress = async () => {
  if (isLoading.value) return

  isLoading.value = true
  try {
    const stepData = getStepData(currentStep.value)
    await mockApi.saveProgress(currentStep.value, stepData)
    lastSaved.value = new Date()
  } catch (error) {
    console.error('Failed to save progress:', error)
    alert('Failed to save progress. Please try again.')
  } finally {
    isLoading.value = false
  }
}

const saveTreatmentPlan = async () => {
  if (isSaving.value) return

  isSaving.value = true
  try {
    await mockApi.saveTreatmentPlan(formData.value)
    lastSaved.value = new Date()
    alert('Treatment plan saved successfully!')
  } catch (error) {
    console.error('Failed to save treatment plan:', error)
    alert('Failed to save treatment plan. Please try again.')
  } finally {
    isSaving.value = false
  }
}

const getStepData = (stepNumber: number): any => {
  switch (stepNumber) {
    case 1:
      return {
        planName: formData.value.planName,
        patientType: formData.value.patientType,
        treatmentCategory: formData.value.treatmentCategory,
        priority: formData.value.priority,
        estimatedDuration: formData.value.estimatedDuration,
        assignedProvider: formData.value.assignedProvider,
        description: formData.value.description,
      }
    case 3:
      return {
        dosage: formData.value.dosage,
        frequency: formData.value.frequency,
        duration: formData.value.duration,
        weight: formData.value.weight,
        height: formData.value.height,
        targetValue: formData.value.targetValue,
        currentValue: formData.value.currentValue,
        maximumValue: formData.value.maximumValue,
      }
    case 4:
      return {
        question1: formData.value.question1,
        question1Details: formData.value.question1Details,
        question2: formData.value.question2,
        question2Details: formData.value.question2Details,
        question3: formData.value.question3,
        question3Details: formData.value.question3Details,
        question4: formData.value.question4,
        question4Details: formData.value.question4Details,
      }
    case 5:
      return {
        medicalReports: uploadedFiles.value.medicalReports,
        treatmentImages: uploadedFiles.value.treatmentImages,
      }
    default:
      return {}
  }
}

const toggleAccordion = (section: string) => {
  accordionOpen.value[section] = !accordionOpen.value[section]
}

const handleFileUpload = (category: string, files: FileList | null) => {
  if (files) {
    const fileArray = Array.from(files)
    uploadedFiles.value[category as keyof typeof uploadedFiles.value].push(...fileArray)
  }
}

const removeFile = (category: string, index: number) => {
  uploadedFiles.value[category as keyof typeof uploadedFiles.value].splice(index, 1)
}

const getPriorityVariant = (priority: string): 'default' | 'destructive' | 'secondary' => {
  switch (priority) {
    case 'urgent':
      return 'destructive'
    case 'high':
      return 'default'
    default:
      return 'secondary'
  }
}

const createTreatmentPlan = () => {
  console.log('Creating treatment plan with data:', {
    formData: formData.value,
    uploadedFiles: uploadedFiles.value,
  })
  // Handle treatment plan creation
}
</script>
