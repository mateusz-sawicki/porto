<template>
  <div class="space-y-8">
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
            :checked="formData[question.key] === 'yes'"
            @change="updateField(question.key, 'yes')"
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
            :checked="formData[question.key] === 'no'"
            @change="updateField(question.key, 'no')"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
          />
          <Label :for="`${question.key}-no`" class="cursor-pointer">No</Label>
        </div>
      </div>

      <div v-if="formData[question.key] === 'yes'" class="space-y-2 mt-4">
        <Label :for="`${question.key}-details`">Please provide details:</Label>
        <Textarea
          :id="`${question.key}-details`"
          :model-value="formData[`${question.key}Details`]"
          @update:model-value="updateField(`${question.key}Details`, $event)"
          placeholder="Enter additional details..."
          class="min-h-[80px]"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface AssessmentQuestion {
  key: string
  text: string
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

interface Props {
  formData: AssessmentData
  assessmentQuestions: AssessmentQuestion[]
}

interface Emits {
  (e: 'update:formData', data: AssessmentData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const updateField = (field: keyof AssessmentData, value: string) => {
  const updatedData = { ...props.formData, [field]: value }
  emit('update:formData', updatedData)
}
</script> 