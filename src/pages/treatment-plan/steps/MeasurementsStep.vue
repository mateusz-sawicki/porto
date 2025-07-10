<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- <div class="space-y-2">
        <Label for="dosage">Dosage (mg)</Label>
        <Input
          id="dosage"
          type="number"
          :model-value="formData.dosage"
          @update:model-value="updateField('dosage', $event)"
          placeholder="Enter dosage"
        />
      </div>

      <div class="space-y-2">
        <Label for="frequency">Frequency (per day)</Label>
        <Input
          id="frequency"
          type="number"
          :model-value="formData.frequency"
          @update:model-value="updateField('frequency', $event)"
          placeholder="Times per day"
        />
      </div>

      <div class="space-y-2">
        <Label for="duration">Duration (days)</Label>
        <Input
          id="duration"
          type="number"
          :model-value="formData.duration"
          @update:model-value="updateField('duration', $event)"
          placeholder="Treatment duration"
        />
      </div>

      <div class="space-y-2">
        <Label for="weight">Patient Weight (kg)</Label>
        <Input
          id="weight"
          type="number"
          step="0.1"
          :model-value="formData.weight"
          @update:model-value="updateField('weight', $event)"
          placeholder="Weight in kg"
        />
      </div>

      <div class="space-y-2">
        <Label for="height">Patient Height (cm)</Label>
        <Input
          id="height"
          type="number"
          :model-value="formData.height"
          @update:model-value="updateField('height', $event)"
          placeholder="Height in cm"
        />
      </div>

      <div class="space-y-2">
        <Label for="targetValue">Target Value</Label>
        <Input
          id="targetValue"
          type="number"
          step="0.1"
          :model-value="formData.targetValue"
          @update:model-value="updateField('targetValue', $event)"
          placeholder="Target measurement"
        />
      </div>

      <div class="space-y-2">
        <Label for="currentValue">Current Value</Label>
        <Input
          id="currentValue"
          type="number"
          step="0.1"
          :model-value="formData.currentValue"
          @update:model-value="updateField('currentValue', $event)"
          placeholder="Current measurement"
        />
      </div>

      <div class="space-y-2">
        <Label for="maximumValue">Maximum Value</Label>
        <Input
          id="maximumValue"
          type="number"
          step="0.1"
          :model-value="formData.maximumValue"
          @update:model-value="updateField('maximumValue', $event)"
          placeholder="Maximum allowed"
        />
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

interface Props {
  formData: MeasurementsData
}

interface Emits {
  (e: 'update:formData', data: MeasurementsData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const updateField = (field: keyof MeasurementsData, value: string) => {
  const updatedData = { ...props.formData, [field]: value }
  emit('update:formData', updatedData)
}
</script>
