<script setup lang="ts">
import { Check, Circle, Dot } from 'lucide-vue-next'
import { ref, reactive } from 'vue'
import { Button } from '@/components/ui/button'
import OdontogramStep from './steps/OdontogramStep.vue'

const stepIndex = ref(1)
const steps = [
  {
    step: 1,
    title: 'Treatment Plan Information',
    description: 'Provide treatment plan details',
  },
  {
    step: 2,
    title: 'Odontogram',
    description: 'Configure tooth treatments',
  },
]

const formData = ref({})
const vueformRef = ref<any>(null)

function handleNextStep() {
  if (vueformRef.value) {
    vueformRef.value.submit()
  }
}

const treatmentPlanSchema = {
  patientName: {
    type: 'text',
    label: 'Patient Name',
    placeholder: 'Enter patient name',
    rules: ['required'],
  },
  treatmentDate: {
    type: 'date',
    label: 'Treatment Date',
    rules: ['required'],
  },
  treatmentType: {
    type: 'select',
    label: 'Treatment Type',
    placeholder: 'Select treatment type',
    rules: ['required'],
    items: [
      { value: 'cleaning', label: 'Cleaning' },
      { value: 'filling', label: 'Filling' },
      { value: 'crown', label: 'Crown' },
      { value: 'extraction', label: 'Extraction' },
      { value: 'root_canal', label: 'Root Canal' },
      { value: 'orthodontics', label: 'Orthodontics' },
      { value: 'implant', label: 'Implant' },
      { value: 'other', label: 'Other' },
    ],
  },
  priority: {
    type: 'radiogroup',
    label: 'Priority Level',
    rules: ['required'],
    items: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
      { value: 'urgent', label: 'Urgent' },
    ],
  },
  description: {
    type: 'textarea',
    label: 'Treatment Description',
    placeholder: 'Enter detailed treatment description',
    rules: ['required'],
    rows: 4,
  },
  estimatedCost: {
    type: 'text',
    label: 'Estimated Cost',
    placeholder: '0.00',
    inputType: 'number',
    step: 0.01,
  },
  notes: {
    type: 'textarea',
    label: 'Additional Notes',
    placeholder: 'Any additional notes or special instructions',
    rows: 3,
  },
  followUpRequired: {
    type: 'checkbox',
    text: 'Follow-up required',
  },
  followUpDate: {
    type: 'date',
    label: 'Follow-up Date',
    conditions: [['followUpRequired', true]],
  },
}

function onSubmitStep1(data: any) {
  formData.value = { ...formData.value, ...data }
  nextStep()
}

function onFinalSubmit() {
  console.log('Treatment plan submitted:', formData.value)
}

function nextStep() {
  if (stepIndex.value < steps.length) {
    stepIndex.value++
  }
}

function prevStep() {
  if (stepIndex.value > 1) {
    stepIndex.value--
  }
}
</script>

<template>
  <div class="w-full">
    <div class="block w-full">
      <!-- Custom stepper header -->
      <div class="flex w-full flex-start gap-2 mb-6">
        <div
          v-for="step in steps"
          :key="step.step"
          class="relative flex w-full flex-col items-center justify-center"
        >
          <div
            v-if="step.step !== steps[steps.length - 1].step"
            class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted"
            :class="{ 'bg-primary': step.step < stepIndex }"
          />

          <Button
            :variant="step.step <= stepIndex ? 'default' : 'outline'"
            size="icon"
            class="z-10 rounded-full shrink-0"
            :class="[
              step.step === stepIndex && 'ring-2 ring-ring ring-offset-2 ring-offset-background',
            ]"
            :disabled="step.step > stepIndex"
            @click="stepIndex = step.step"
          >
            <Check v-if="step.step < stepIndex" class="size-5" />
            <Circle v-else-if="step.step === stepIndex" />
            <Dot v-else />
          </Button>

          <div class="mt-5 flex flex-col items-center text-center">
            <div
              :class="[step.step === stepIndex && 'text-primary']"
              class="text-sm font-semibold transition lg:text-base"
            >
              {{ step.title }}
            </div>
            <div
              :class="[step.step === stepIndex && 'text-primary']"
              class="sr-only text-xs text-muted-foreground transition md:not-sr-only lg:text-sm"
            >
              {{ step.description }}
            </div>
          </div>
        </div>
      </div>

      <!-- Step content -->
      <div class="mt-6">
        <!-- Step 1: VueForms Treatment Plan Form -->
        <div v-if="stepIndex === 1">
          <div class="space-y-4">
            <Vueform
              ref="vueformRef"
              v-model="formData"
              :schema="treatmentPlanSchema"
              @submit="onSubmitStep1"
              :endpoint="false"
              :submit-button="false"
              size="lg"
            />

            <div class="flex items-center justify-between pt-4">
              <Button disabled variant="outline" size="sm"> Back </Button>
              <Button size="sm" @click="handleNextStep"> Next </Button>
            </div>
          </div>
        </div>

        <!-- Step 2: Odontogram -->
        <div v-if="stepIndex === 2">
          <OdontogramStep :isPediatric="true" />

          <div class="flex items-center justify-between mt-6">
            <Button variant="outline" size="sm" @click="prevStep()"> Back </Button>
            <Button size="sm" @click="onFinalSubmit()"> Submit Treatment Plan </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
