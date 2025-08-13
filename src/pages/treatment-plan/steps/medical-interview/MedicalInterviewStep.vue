<template>
  <div class="max-w-md mx-auto p-6 space-y-6">
    <h2 class="text-2xl font-bold text-center">Formularz z Checkbox</h2>

    <form :validation-schema="formSchema" @submit="onSubmit" class="space-y-6">
      <!-- Checkbox with TextField Component -->
      <CheckBoxWithTextField
        v-model="showAdditionalField"
        name="showAdditionalField"
        checkbox-label="Pokaż dodatkowe pole tekstowe"
        text-field-label="Dodatkowe informacje (opcjonalne)"
        text-field-placeholder="Wpisz dodatkowe informacje..."
      />

      <!-- Submit Button -->
      <Button type="submit" class="w-full"> Wyślij formularz </Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import CheckBoxWithTextField from '@/components/forms/CheckBoxWithTextField.vue'
import { toast } from 'vue-sonner'

// Schema walidacji
const formSchema = toTypedSchema(
  z.object({
    showAdditionalField: z.boolean().default(false),
    showAdditionalFieldDescription: z.string().optional(),
  }),
)

// Reactive refs
const showAdditionalField = ref(false)

// Formularz setup
const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    showAdditionalFieldDescription: '',
  },
})

const formValues = form.values

// Watch checkbox field changes and clear text when unchecked
watch(
  () => showAdditionalField.value,
  (newValue) => {
    // Sync with form field
    form.setFieldValue('showAdditionalField', newValue)
    if (!newValue) {
      form.setFieldValue('showAdditionalFieldDescription', '')
    }
  },
  { immediate: true },
)

// Submit handler
const onSubmit = form.handleSubmit((values) => {
  console.log('Form values:', values)

  // Use form values directly since they're now synced
  const formData = {
    showAdditionalField: values.showAdditionalField,
    showAdditionalFieldDescription: values.showAdditionalFieldDescription,
  }

  console.log('Final formData:', formData)

  toast({
    title: 'Formularz wysłany!',
    description: `Checkbox: ${formData.showAdditionalField ? 'zaznaczony' : 'odznaczony'}, Tekst: "${formData.showAdditionalFieldDescription}"`,
  })

  // Tutaj możesz dodać logikę wysyłania danych do API
  // await submitToAPI(formData)
})
</script>
