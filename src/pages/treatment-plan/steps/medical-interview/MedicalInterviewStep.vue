<template>
  <div class="p-6 space-y-6">
    <form :validation-schema="formSchema" @submit="onSubmit" class="space-y-8">
      <!-- Dynamic Sections -->
      <div
        v-for="(section, sectionKey) in fieldConfigs.sections"
        :key="sectionKey"
        class="space-y-4"
      >
        <h2 class="text-lg font-bold">{{ section.title }}</h2>
        <h5 class="text-md whitespace-pre-line">{{ section.description }}</h5>
        <template v-if="section.subsections && section.subsections.length > 0">
          <div
            v-for="(subsection, subsectionIndex) in section.subsections"
            :key="subsectionIndex"
            class="space-y-3"
          >
            <h4 v-if="subsection.title" class="text-md">{{ subsection.title }}</h4>
            <template v-for="field in subsection.fields" :key="field.name">
              <CheckBoxWithTextField
                v-if="field.type === 'checkboxWithTextField'"
                :name="`${section.name}.${subsection.name}.${field.name}`"
                :checkbox-label="field.checkboxLabel"
                :text-field-label="(field as any).textFieldLabel || null"
                :text-field-placeholder="field.textFieldPlaceholder"
              />
            </template>
          </div>
        </template>
        <template v-if="!section.subsections || section.subsections.length === 0">
          <template v-for="field in section.fields" :key="(field as any).name">
            <CheckBoxWithTextField
              v-if="(field as any).type === 'checkboxWithTextField'"
              :name="`${section.name}.fields.${(field as any).name}`"
              :checkbox-label="(field as any).checkboxLabel"
              :text-field-label="(field as any).textFieldLabel || null"
              :text-field-placeholder="(field as any).textFieldPlaceholder"
            />
          </template>
        </template>
      </div>

      <!-- Submit Button -->
      <Button type="submit" class="max-w-md"> Wyślij formularz </Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import CheckBoxWithTextField from '@/components/forms/CheckBoxWithTextField.vue'
const medicalHistoryTextFieldPlaceholder = 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...'
// Field configuration for dynamic rendering
const fieldConfigs = {
  sections: [
    {
      description:
        'Proszę szczegółowo odpowiedzieć na wszystkie pytania, aby pomóc w postawieniu diagnozy i ułożeniu planu leczenia.',
      fields: [],
      name: 'medicalHistory',
      subsections: [
        {
          description: null,
          fields: [
            {
              checkboxLabel: 'Choroby serca?',
              name: 'heartDisease',
              textFieldPlaceholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              type: 'checkboxWithTextField',
            },
            {
              checkboxLabel: 'Choroby sercowo naczyniowe?',
              name: 'cardiovascularDiseases',
              textFieldPlaceholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              type: 'checkboxWithTextField',
            },
            {
              checkboxLabel: 'Nadciśnienie krwi?',
              name: 'hypertension',
              textFieldPlaceholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              type: 'checkboxWithTextField',
            },
            {
              checkboxLabel: 'Krwawienie, zaburzenia krzepnięcia krwi?',
              name: 'bloodDisorders',
              textFieldPlaceholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              type: 'checkboxWithTextField',
            },
            {
              checkboxLabel: 'Choroby nowotworowe?',
              name: 'cancer',
              textFieldPlaceholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              type: 'checkboxWithTextField',
            },
            {
              checkboxLabel: 'Zaburzenia odżywiania?',
              name: 'eatingDisorders',
              textFieldPlaceholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              type: 'checkboxWithTextField',
            },
            {
              checkboxLabel: 'Choroby układu odpornościowego?',
              name: 'immuneSystemDiseases',
              textFieldPlaceholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              type: 'checkboxWithTextField',
            },
            {
              checkboxLabel: 'WZW typ B/C?',
              name: 'hepatisisBOrC',
              textFieldPlaceholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              type: 'checkboxWithTextField',
            },
            {
              checkboxLabel: 'HIV?',
              name: 'hiv',
              textFieldPlaceholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              type: 'checkboxWithTextField',
            },
            {
              checkboxLabel: 'Choroby neurologiczne?',
              name: 'neurologicalDiseases',
              textFieldPlaceholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              type: 'checkboxWithTextField',
            },
            {
              checkboxLabel: 'Padaczka?',
              name: 'epilepsy',
              textFieldPlaceholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              type: 'checkboxWithTextField',
            },
            {
              checkboxLabel: 'Zaburzenia hormonalne?',
              name: 'hormonalDisorders',
              textFieldPlaceholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              type: 'checkboxWithTextField',
            },
            {
              checkboxLabel: 'Cukrzyca?',
              name: 'diabetes',
              textFieldPlaceholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              type: 'checkboxWithTextField',
            },
            {
              checkboxLabel: 'Wady wrodzone?',
              name: 'congenitalDefects',
              textFieldPlaceholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              type: 'checkboxWithTextField',
            },
            {
              checkboxLabel: 'Choroby dziedziczne?',
              name: 'hereditaryDiseases',
              textFieldPlaceholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              type: 'checkboxWithTextField',
            },
            {
              checkboxLabel: 'Choroby reumatoidalne?',
              name: 'rheumatoidDiseases',
              textFieldPlaceholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              type: 'checkboxWithTextField',
            },
            {
              checkboxLabel: 'Choroby układu kostnego?',
              name: 'skeletalDiseases',
              textFieldPlaceholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              type: 'checkboxWithTextField',
            },
            {
              checkboxLabel: 'Choroby nerek?',
              name: 'kidneyDiseases',
              textFieldPlaceholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              type: 'checkboxWithTextField',
            },
            {
              checkboxLabel: 'Choroby wątroby?',
              name: 'liverDiseases',
              textFieldPlaceholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              type: 'checkboxWithTextField',
            },
            {
              checkboxLabel: 'Choroby psychiczne?',
              name: 'mentalIllnesses',
              textFieldPlaceholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              type: 'checkboxWithTextField',
            },
            {
              checkboxLabel: 'Depresja?',
              name: 'depression',
              textFieldPlaceholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              type: 'checkboxWithTextField',
            },
            {
              checkboxLabel: 'Czy w czasie ostatnich 3 lat była konsultacja psychiatryczna?',
              name: 'psychiatricConsultationInLastThreeYears',
              textFieldPlaceholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              type: 'checkboxWithTextField',
            },
            {
              checkboxLabel: 'Astma?',
              name: 'asthma',
              textFieldPlaceholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              type: 'checkboxWithTextField',
            },
            {
              checkboxLabel: 'Alergie?',
              name: 'allergies',
              textFieldPlaceholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              type: 'checkboxWithTextField',
            },
          ],
          name: 'patientDiseases',
          title: 'Czy pacjent choruje na:',
        },
        {
          description: 'Czy pacjent choruje na:',
          fields: [
            {
              checkboxLabel: 'ADHD?',
              name: 'adhd',
              textFieldLabel: 'Uwagi?',
              textFieldPlaceholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              type: 'checkboxWithTextField',
            },
            {
              checkboxLabel: 'Dysleksja?',
              name: 'dyslexia',
              textFieldLabel: 'Uwagi?',
              textFieldPlaceholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              type: 'checkboxWithTextField',
            },
            {
              checkboxLabel: 'Zespół Aspergera?',
              name: 'aspergersSyndrome',
              textFieldLabel: 'Uwagi?',
              textFieldPlaceholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              type: 'checkboxWithTextField',
            },
            {
              checkboxLabel: 'Zaburzenia koordynacji?',
              name: 'coordinationDisorders',
              textFieldLabel: 'Jakie?',
              textFieldPlaceholder: 'Opisz pełne rozpoznanie, od kiedy, rodzaj leczenia...',
              type: 'checkboxWithTextField',
            },
          ],
          name: 'patientDisorders',
          title: 'Czy podejrzewa się lub zdiagnozowano zaburzenia:',
        },
      ],
      title: 'Historia medyczna',
    },
  ],
  template: 'medicalInterview',
}

// Generate schemas dynamically from field configs
const createCheckboxWithTextFieldSchema = (fields: any[]) => {
  const schemaObj: any = {}
  fields.forEach((field: any) => {
    if (field.type === 'checkboxWithTextField') {
      schemaObj[field.name] = z.boolean().default(false)
      schemaObj[`${field.name}Description`] = z.string().default('')
    }
  })
  return z.object(schemaObj)
}

// Generate all schemas dynamically from fieldConfigs
const generateFormSchema = () => {
  const schemaObj: any = {}

  fieldConfigs.sections.forEach((section: any) => {
    const sectionSchemaObj: any = {}

    // Create separate schemas for each subsection
    if (section.subsections && section.subsections.length > 0) {
      section.subsections.forEach((subsection: any) => {
        if (subsection.fields && subsection.fields.length > 0) {
          sectionSchemaObj[subsection.name] = createCheckboxWithTextFieldSchema(subsection.fields)
        }
      })
    }

    // Add direct fields if no subsections
    if (section.fields && section.fields.length > 0) {
      sectionSchemaObj.fields = createCheckboxWithTextFieldSchema(section.fields)
    }

    schemaObj[section.name] = z.object(sectionSchemaObj)
  })

  return z.object(schemaObj)
}

// Combined nested schema - completely dynamic
const formSchema = toTypedSchema(generateFormSchema())

// Formularz setup
const form = useForm({
  validationSchema: formSchema,
})

// No need for manual field states - vee-validate handles this automatically

// Submit handler
const onSubmit = form.handleSubmit((values) => {
  console.log('Form values:', values)
})
</script>
