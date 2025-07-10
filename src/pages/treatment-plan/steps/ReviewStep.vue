<template>
  <div class="space-y-8">
    <!-- <div class="text-center mb-6">
      <h3 class="text-2xl font-bold mb-2">Treatment Plan Summary</h3>
      <p class="text-muted-foreground">Review all information before proceeding</p>
    </div>

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
            <p class="font-medium">{{ basicInfo.planName || 'Not specified' }}</p>
          </div>
          <div>
            <Label class="text-sm font-medium text-muted-foreground">Patient Type</Label>
            <p class="font-medium capitalize">
              {{ basicInfo.patientType || 'Not specified' }}
            </p>
          </div>
          <div>
            <Label class="text-sm font-medium text-muted-foreground">Category</Label>
            <p class="font-medium capitalize">
              {{ basicInfo.treatmentCategory?.replace('-', ' ') || 'Not specified' }}
            </p>
          </div>
          <div>
            <Label class="text-sm font-medium text-muted-foreground">Duration</Label>
            <p class="font-medium">
              {{ basicInfo.estimatedDuration?.replace('-', ' ') || 'Not specified' }}
            </p>
          </div>
        </div>
        <div>
          <Label class="text-sm font-medium text-muted-foreground">Description</Label>
          <p class="mt-1">{{ basicInfo.description || 'No description provided' }}</p>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <User class="w-5 h-5" />
          Odontogram Procedures
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div v-if="teethWithProcedures.length === 0" class="text-muted-foreground">
          No procedures selected on the dental chart
        </div>
        <div v-else class="space-y-3">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-primary">
                {{ teethWithProcedures.length }}
              </div>
              <div class="text-xs text-muted-foreground">Teeth with procedures</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-primary">
                {{
                  teethWithProcedures.reduce(
                    (total, tooth) => total + tooth.procedures.length,
                    0,
                  )
                }}
              </div>
              <div class="text-xs text-muted-foreground">Total procedures</div>
            </div>
          </div>
          <div class="space-y-2">
            <div
              v-for="tooth in teethWithProcedures"
              :key="tooth.toothNumber"
              class="border rounded-lg p-3"
            >
              <div class="font-medium mb-2">Tooth {{ tooth.toothNumber }}</div>
              <div class="space-y-1">
                <div
                  v-for="procedure in tooth.procedures"
                  :key="procedure.name"
                  class="flex items-center gap-2 text-sm"
                >
                  <div
                    v-if="procedure.visual.visualType === 'Color'"
                    class="w-3 h-3 rounded-sm"
                    :style="{ backgroundColor: procedure.visual.value }"
                  />
                  <div
                    v-else-if="procedure.visual.visualType === 'Icon'"
                    class="w-3 h-3 flex items-center justify-center text-xs font-bold"
                  >
                    {{ procedure.visual.value }}
                  </div>
                  <div
                    v-else-if="procedure.visual.visualType === 'GumShape'"
                    class="w-3 h-3 rounded-full border"
                    :style="{ borderColor: procedure.visual.value }"
                  />
                  <div v-else class="w-3 h-3 rounded-sm bg-gray-200" />
                  <span>{{ procedure.name }}</span>
                  <span v-if="procedure.description" class="text-muted-foreground"
                    >- {{ procedure.description }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

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
            {{ assessmentData[question.key] || 'Not answered' }}
          </p>
          <p
            v-if="
              assessmentData[question.key] === 'yes' &&
              assessmentData[`${question.key}Details`]
            "
            class="mt-2 text-sm bg-gray-50 p-2 rounded"
          >
            {{ assessmentData[`${question.key}Details`] }}
          </p>
        </div>
      </CardContent>
    </Card>

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
    </Card> -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FileText, User, Calculator, HelpCircle, Camera } from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

interface BasicInformationData {
  planName: string
  patientType: string
  treatmentCategory: string
  estimatedDuration: string
  assignedProvider: string
  description: string
}

interface MeasurementsData {
  dosage: string
  frequency: string
  duration: string
  weight: string
  height: string
  targetValue: string
  currentValue: string
  maximumValue: string
}

interface AssessmentData {
  question1: string
  question1Details: string
  question2: string
  question2Details: string
  question3: string
  question3Details: string
  question4: string
  question4Details: string
}

interface AssessmentQuestion {
  key: string
  text: string
}

interface Procedure {
  name: string
  description?: string
  visual: {
    visualType: 'Color' | 'Pattern' | 'Icon' | 'GumShape' | 'ToothShape'
    value: string
  }
}

interface ToothWithProcedures {
  toothNumber: string
  procedures: Procedure[]
}

interface UploadedFiles {
  medicalReports: File[]
  treatmentImages: File[]
}

interface MeasurementItem {
  label: string
  value: string
  unit: string
}

interface Props {
  basicInfo: BasicInformationData
  measurements: MeasurementsData
  assessmentData: AssessmentData
  assessmentQuestions: AssessmentQuestion[]
  teethWithProcedures: ToothWithProcedures[]
  uploadedFiles: UploadedFiles
}

const props = defineProps<Props>()

const measurementItems = computed((): MeasurementItem[] => [
  { label: 'Dosage', value: props.measurements.dosage, unit: 'mg' },
  { label: 'Frequency', value: props.measurements.frequency, unit: '/day' },
  { label: 'Duration', value: props.measurements.duration, unit: 'days' },
  { label: 'Weight', value: props.measurements.weight, unit: 'kg' },
  { label: 'Height', value: props.measurements.height, unit: 'cm' },
  { label: 'Target Value', value: props.measurements.targetValue, unit: '' },
  { label: 'Current Value', value: props.measurements.currentValue, unit: '' },
  { label: 'Maximum Value', value: props.measurements.maximumValue, unit: '' },
])
</script>
