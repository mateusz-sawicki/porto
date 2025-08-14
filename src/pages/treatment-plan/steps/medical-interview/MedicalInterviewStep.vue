<template>
  <div class="p-6 space-y-6">
    <form :validation-schema="formSchema" @submit="onSubmit" class="space-y-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                :checkbox-label="(field as any).checkboxLabel"
                :conditional-field="(field as any).conditionalField"
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
                :checkbox-label="(field as any).checkboxLabel"
                :conditional-field="(field as any).conditionalField"
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

      <Button type="submit" class="max-w-md"> Wyślij formularz </Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import ConditionalFormField from '@/components/forms/ConditionalFormField.vue'
import TextareaFormField from '@/components/forms/TextareaFormField.vue'
import CheckBoxFormField from '@/components/forms/CheckBoxFormField.vue'
import RadioFormField from '@/components/forms/RadioFormField.vue'
import { fieldConfigs } from './medicalInterviewConfig'

const createConditionalFormFieldSchema = (fields: any[]) => {
  const schemaObj: any = {}
  fields.forEach((field: any) => {
    if (field.type === 'conditionalField') {
      // Handle checkbox with conditional field
      schemaObj[field.name] = z.boolean().default(false)

      // Handle the conditional field value based on its type
      const conditionalFieldType = field.conditionalField?.type
      if (conditionalFieldType === 'textarea') {
        schemaObj[`${field.name}Value`] = z.string().default('')
      } else if (conditionalFieldType === 'select' || conditionalFieldType === 'radio') {
        schemaObj[`${field.name}Value`] = z.string().default('')
      } else if (conditionalFieldType === 'multichoice') {
        schemaObj[`${field.name}Value`] = z.array(z.string()).default([])
      } else if (conditionalFieldType === 'datepicker') {
        schemaObj[`${field.name}Value`] = z.date().optional()
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
})

const onSubmit = form.handleSubmit((values) => {
  console.log('Form values:', values)
})
</script>
