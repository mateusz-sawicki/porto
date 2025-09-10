<!-- <template>
  <Vueform>
    <TextElement name="hello_world" label="Hello" placeholder="World" />
  </Vueform>
  <div class="p-6 space-y-6">
    <form :validation-schema="formSchema" @submit="onSubmit" class="space-y-8">
      <div class="grid grid-cols-1 gap-8">
        <div v-for="(section, sectionKey) in fieldConfigs.sections" :key="sectionKey">
          <h2 class="text-lg font-bold mb-2">{{ section.title }}</h2>
          <h5 class="text-md whitespace-pre-line mb-2">{{ section.description }}</h5>
          <template v-if="section.subsections && section.subsections.length > 0">
            <div
              v-for="(subsection, subsectionIndex) in section.subsections"
              :key="subsectionIndex"
              class="space-y-3 mb-8"
            >
              <h4 v-if="subsection.title" class="text-md my-5">{{ subsection.title }}</h4>
              <template v-for="field in subsection.fields" :key="field.name">
                <TextareaFormField
                  v-if="field.type === 'textarea'"
                  :name="`${section.name}.${subsection.name}.${field.name}`"
                  :label="(field as any).textFieldLabel"
                  :placeholder="(field as any).textFieldPlaceholder"
                />
                <ConditionalFormField
                  v-if="field.type === 'conditionalField'"
                  :name="`${section.name}.${subsection.name}.${field.name}`"
                  :label="(field as any).label"
                  :conditional-fields="(field as any).conditionalFields"
                />
                <CheckBoxFormField
                  v-if="field.type === 'checkbox'"
                  :name="`${section.name}.${subsection.name}.${field.name}`"
                  :label="(field as any).label"
                />
                <RadioFormField
                  v-if="field.type === 'radio'"
                  :name="`${section.name}.${subsection.name}.${field.name}`"
                  :label="(field as any).label"
                  :options="(field as any).options"
                />
              </template>
            </div>
          </template>
          <template v-if="!section.subsections || section.subsections.length === 0">
            <div class="space-y-3 mb-8">
              <template v-for="field in section.fields" :key="(field as any).name">
                <ConditionalFormField
                  v-if="(field as any).type === 'conditionalField'"
                  :name="`${section.name}.fields.${(field as any).name}`"
                  :label="(field as any).label"
                  :conditional-fields="(field as any).conditionalFields"
                />
                <TextareaFormField
                  v-if="(field as any).type === 'textarea'"
                  :name="`${section.name}.fields.${(field as any).name}`"
                  :label="(field as any).textFieldLabel"
                  :placeholder="(field as any).textFieldPlaceholder"
                />
                <CheckBoxFormField
                  v-if="(field as any).type === 'checkbox'"
                  :name="`${section.name}.fields.${(field as any).name}`"
                  :label="(field as any).label"
                />
                <RadioFormField
                  v-if="(field as any).type === 'radio'"
                  :name="`${section.name}.fields.${(field as any).name}`"
                  :label="(field as any).label"
                  :options="(field as any).options"
                />
              </template>
            </div>
          </template>
        </div>
      </div>

      <Button type="submit" class="max-w-md" :disabled="isLoading">
        {{ isLoading ? 'Wysyłanie...' : 'Wyślij formularz' }}
      </Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, withDefaults, defineProps, defineEmits } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useRoute, useRouter } from 'vue-router'

import { Button } from '@/components/ui/button'
import ConditionalFormField from '@/components/forms/ConditionalFormField.vue'
import TextareaFormField from '@/components/forms/TextareaFormField.vue'
import CheckBoxFormField from '@/components/forms/CheckBoxFormField.vue'
import RadioFormField from '@/components/forms/RadioFormField.vue'
import { fieldConfigs } from './medicalInterviewConfig'
import { api, API_URL } from '@/services/api'

// Props
interface Props {
  formData?: {
    medicalHistory?: any
    infancy?: any
    dentalInterview?: any
    allergicProblems?: any
  }
}

const props = withDefaults(defineProps<Props>(), {
  formData: () => ({
    medicalHistory: {},
    infancy: {},
    dentalInterview: {},
    allergicProblems: {},
  }),
})

// Emits
const emit = defineEmits<{
  'update:form-data': [data: any]
}>()

// Router and state
const route = useRoute()
const router = useRouter()
const isLoading = ref(false)

const createConditionalFormFieldSchema = (fields: any[]) => {
  const schemaObj: any = {}
  fields.forEach((field: any) => {
    if (field.type === 'conditionalField') {
      // Handle checkbox with conditional field(s)
      schemaObj[field.name] = z.boolean().default(false)

      // Helper function to create schema for a conditional field
      const createSchemaForConditionalFieldType = (conditionalField: any) => {
        if (conditionalField.type === 'textarea') {
          return z.string().default('')
        } else if (conditionalField.type === 'select' || conditionalField.type === 'radio') {
          return z.string().default('')
        } else if (conditionalField.type === 'multichoice') {
          return z.array(z.string()).default([])
        } else if (conditionalField.type === 'datepicker') {
          return z.date().optional()
        } else if (conditionalField.type === 'conditionalField') {
          // Handle nested conditional field - return boolean for the checkbox
          return z.boolean().default(false)
        }
        return z.string().default('')
      }

      // Handle multiple conditional fields
      if (field.conditionalFields && Array.isArray(field.conditionalFields)) {
        field.conditionalFields.forEach((conditionalField: any, index: number) => {
          const suffix = field.conditionalFields.length === 1 ? 'Value' : `Value${index + 1}`
          schemaObj[`${field.name}${suffix}`] =
            createSchemaForConditionalFieldType(conditionalField)

          // If it's a nested conditional field, we need to recursively create schemas for its conditional fields
          if (conditionalField.type === 'conditionalField' && conditionalField.conditionalFields) {
            conditionalField.conditionalFields.forEach((nestedField: any, nestedIndex: number) => {
              const nestedSuffix =
                conditionalField.conditionalFields.length === 1
                  ? 'Value'
                  : `Value${nestedIndex + 1}`
              schemaObj[`${field.name}${suffix}${nestedSuffix}`] =
                createSchemaForConditionalFieldType(nestedField)
            })
          }
        })
      }
    } else if (field.type === 'textarea') {
      schemaObj[field.name] = z.string().default('')
    } else if (field.type === 'checkbox') {
      // Handle simple checkbox
      schemaObj[field.name] = z.boolean().default(false)
    } else if (field.type === 'radio') {
      // Handle simple radio group
      schemaObj[field.name] = z.string().default('')
    }
  })
  return z.object(schemaObj)
}

const generateFormSchema = () => {
  const schemaObj: any = {}

  fieldConfigs.sections.forEach((section: any) => {
    const sectionSchemaObj: any = {}

    if (section.subsections && section.subsections.length > 0) {
      section.subsections.forEach((subsection: any) => {
        if (subsection.fields && subsection.fields.length > 0) {
          sectionSchemaObj[subsection.name] = createConditionalFormFieldSchema(subsection.fields)
        }
      })
    }

    if (section.fields && section.fields.length > 0) {
      sectionSchemaObj.fields = createConditionalFormFieldSchema(section.fields)
    }

    schemaObj[section.name] = z.object(sectionSchemaObj)
  })

  return z.object(schemaObj)
}

const formSchema = toTypedSchema(generateFormSchema())

const form = useForm({
  validationSchema: formSchema,
  initialValues: props.formData,
})

// Watch for changes in formData prop and update form values
watch(
  () => props.formData,
  (newFormData) => {
    console.log('MedicalInterviewStep - formData changed:', newFormData)
    if (newFormData && Object.keys(newFormData).length > 0) {
      console.log('MedicalInterviewStep - setting form values:', newFormData)
      // Try resetForm instead of setValues to ensure proper reactivity
      form.resetForm({
        values: newFormData,
      })
      console.log('MedicalInterviewStep - current form values after resetForm:', form.values)
    }
  },
  { deep: true, immediate: true },
)

const onSubmit = form.handleSubmit(async (values) => {
  try {
    isLoading.value = true
    console.log(route)
    // Get treatment plan ID from route parameters
    const treatmentPlanId = route.params.planId
    console.log('Route params:', route.params)
    console.log('Treatment plan ID:', treatmentPlanId)

    if (!treatmentPlanId) {
      alert('Treatment plan ID not found')
      return
    }

    // Get current step (assume this is step 1)
    const targetStep = 2 // Next step after Basic Information

    // Make PUT request to API
    console.log('API Base URL:', API_URL)
    console.log('Making API call to:', `/api/treatment-plans/${treatmentPlanId}`)
    console.log('Full URL will be:', `${API_URL}/api/treatment-plans/${treatmentPlanId}`)
    console.log('Sending data:', { targetStep: targetStep, formData: values })

    console.log('About to call api.put...')
    try {
      const result = await api.put(`/api/treatment-plans/${treatmentPlanId}`, {
        targetStep: targetStep,
        medicalInterviewStepData: values,
      })
      console.log('API call completed successfully:', result)
      console.log('Medical interview submitted successfully:', result)
    } catch (apiError) {
      console.error('API call failed:', apiError)
      throw apiError
    }

    // Show success message
    alert('Medical interview submitted successfully!')

    // Navigate back to patient details or stay on current page
    // You can modify this behavior as needed
  } catch (error) {
    console.error('Error submitting medical interview:', error)
    alert('Failed to submit medical interview. Please try again.')
  } finally {
    isLoading.value = false
  }
})
</script> -->

<template>
  <div class="container">
    <h1>Rejestracja użytkownika - Multi-step</h1>

    <Vueform
      ref="form$"
      :schema="schema"
      @submit="handleSubmit"
      @step="handleStepChange"
      :steps="steps"
      sync
    >
      <!-- Niestandardowy progress bar -->
      <template #step-controls="{ steps, current$ }">
        <div class="progress-bar">
          <div
            v-for="(step, index) in steps"
            :key="step.name"
            class="progress-step"
            :class="{
              active: current$.index >= index,
              current: current$.index === index,
            }"
          >
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-label">{{ step.label }}</div>
          </div>
        </div>
      </template>
    </Vueform>

    <!-- Debug panel -->
    <div class="debug-panel" v-if="form$">
      <h3>Aktualne dane:</h3>
      <pre>{{ JSON.stringify(form$.data, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PreviewComponent from './PreviewComponent.vue'

const form$ = ref(null)

// Definicja kroków
const steps = [
  {
    name: 'personal',
    label: 'Dane osobowe',
  },
  {
    name: 'account',
    label: 'Konto',
  },
  {
    name: 'preferences',
    label: 'Preferencje',
  },
  {
    name: 'review',
    label: 'Podsumowanie',
  },
]

// Schema formularza
const schema = {
  // KROK 1: Dane osobowe
  firstName: {
    type: 'text',
    label: 'Imię',
    rules: 'required|min:2',
    step: 'personal',
  },
  lastName: {
    type: 'text',
    label: 'Nazwisko',
    rules: 'required|min:2',
    step: 'personal',
  },
  birthDate: {
    type: 'date',
    label: 'Data urodzenia',
    rules: 'required|before:today',
    step: 'personal',
  },
  gender: {
    type: 'radio',
    label: 'Płeć',
    items: {
      male: 'Mężczyzna',
      female: 'Kobieta',
      other: 'Inna',
    },
    step: 'personal',
  },

  // KROK 2: Konto
  email: {
    type: 'text',
    inputType: 'email',
    label: 'Email',
    rules: 'required|email',
    step: 'account',
  },
  password: {
    type: 'text',
    inputType: 'password',
    label: 'Hasło',
    rules: 'required|min:8',
    step: 'account',
  },
  passwordConfirm: {
    type: 'text',
    inputType: 'password',
    label: 'Potwierdź hasło',
    rules: 'required|confirmed:password',
    step: 'account',
  },
  username: {
    type: 'text',
    label: 'Nazwa użytkownika',
    rules: 'required|min:3|max:20',
    step: 'account',
  },

  // KROK 3: Preferencje
  interests: {
    type: 'checkboxes',
    label: 'Zainteresowania',
    items: {
      technology: 'Technologia',
      sports: 'Sport',
      music: 'Muzyka',
      travel: 'Podróże',
      cooking: 'Gotowanie',
      reading: 'Czytanie',
    },
    step: 'preferences',
  },
  newsletter: {
    type: 'checkbox',
    label: 'Chcę otrzymywać newsletter',
    step: 'preferences',
  },
  notifications: {
    type: 'object',
    label: 'Powiadomienia',
    step: 'preferences',
    conditions: [['newsletter', true]],
    schema: {
      email: {
        type: 'checkbox',
        text: 'Email',
        default: true,
      },
      sms: {
        type: 'checkbox',
        text: 'SMS',
      },
      push: {
        type: 'checkbox',
        text: 'Push notifications',
      },
    },
  },
  language: {
    type: 'select',
    label: 'Preferowany język',
    items: {
      pl: 'Polski',
      en: 'English',
      de: 'Deutsch',
      es: 'Español',
    },
    default: 'pl',
    step: 'preferences',
  },

  // KROK 4: Podsumowanie - komponent podglądu
  preview: {
    type: 'static',
    component: PreviewComponent,
    step: 'review',
    props: {
      formData: () => form$.value?.data || {},
    },
  },
  terms: {
    type: 'checkbox',
    label: 'Akceptuję regulamin i politykę prywatności',
    rules: 'accepted',
    step: 'review',
  },
}

// Handlers
function handleSubmit() {
  console.log('Formularz wysłany!', form$.value.data)
  alert('Rejestracja zakończona pomyślnie!')
}

function handleStepChange(step) {
  console.log('Zmiana kroku na:', step)
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.progress-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  padding: 20px 0;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
}

.progress-step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 20px;
  left: 60%;
  right: -40%;
  height: 2px;
  background: #e0e0e0;
  z-index: 1;
}

.progress-step.active:not(:last-child)::after {
  background: #4f46e5;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e0e0e0;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  position: relative;
  z-index: 2;
  margin-bottom: 8px;
}

.progress-step.active .step-number {
  background: #4f46e5;
  color: white;
}

.progress-step.current .step-number {
  background: #4f46e5;
  color: white;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.2);
}

.step-label {
  font-size: 14px;
  color: #666;
  text-align: center;
}

.progress-step.active .step-label {
  color: #4f46e5;
  font-weight: 500;
}

.debug-panel {
  margin-top: 40px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.debug-panel h3 {
  margin-top: 0;
  color: #333;
}

.debug-panel pre {
  background: white;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  max-height: 300px;
  overflow-y: auto;
}
</style>
