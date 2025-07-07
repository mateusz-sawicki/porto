<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <Label for="planName">Treatment Plan Name</Label>
        <Input 
          id="planName" 
          :model-value="formData.planName" 
          @update:model-value="updateField('planName', $event)"
          placeholder="Enter plan name" 
        />
      </div>

      <div class="space-y-2">
        <Label for="patientType">Patient Type</Label>
        <Select :model-value="formData.patientType" @update:model-value="updateField('patientType', $event)">
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
        <Select :model-value="formData.treatmentCategory" @update:model-value="updateField('treatmentCategory', $event)">
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
        <Label for="estimatedDuration">Estimated Duration</Label>
        <Select :model-value="formData.estimatedDuration" @update:model-value="updateField('estimatedDuration', $event)">
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
        <Select :model-value="formData.assignedProvider" @update:model-value="updateField('assignedProvider', $event)">
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
        :model-value="formData.description"
        @update:model-value="updateField('description', $event)"
        placeholder="Provide detailed description of the treatment plan..."
        class="min-h-[120px]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
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

interface BasicInformationData {
  planName: string
  patientType: string
  treatmentCategory: string
  estimatedDuration: string
  assignedProvider: string
  description: string
}

interface Props {
  formData: BasicInformationData
}

interface Emits {
  (e: 'update:formData', data: BasicInformationData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const updateField = (field: keyof BasicInformationData, value: string) => {
  const updatedData = { ...props.formData, [field]: value }
  emit('update:formData', updatedData)
}
</script> 