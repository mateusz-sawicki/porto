<template>
  <div class="max-w-md mx-auto p-6 space-y-6">
    <h2 class="text-2xl font-bold text-center">Formularz z Checkbox</h2>

    <form :validation-schema="formSchema" @submit="onSubmit" class="space-y-6">
      <!-- Checkbox Field -->
      <div class="flex flex-row items-start space-x-3 space-y-0">
        <Checkbox v-model="showAdditionalField" id="showAdditionalField" />
        <div class="space-y-1 leading-none">
          <Label for="showAdditionalField" class="text-sm font-medium cursor-pointer">
            Pokaż dodatkowe pole tekstowe
          </Label>
        </div>
      </div>

      <!-- Warunkowe pole tekstowe -->

      <FormField v-if="showAdditionalField" v-slot="{ componentField }" name="additionalText">
        <FormItem>
          <FormLabel>Dodatkowe informacje (opcjonalne)</FormLabel>
          <FormControl>
            <Input
              v-bind="componentField"
              placeholder="Wpisz dodatkowe informacje..."
              class="transition-all duration-200"
              type="text"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Submit Button -->
      <Button type="submit" class="w-full"> Wyślij formularz </Button>
    </form>

    <!-- Podgląd stanu (opcjonalny) -->
    <div class="p-4 bg-muted rounded-md">
      <h3 class="font-semibold text-sm mb-2">Stan formularza:</h3>
      <p class="text-xs text-muted-foreground">
        Checkbox: {{ showAdditionalField ? 'zaznaczony' : 'odznaczony' }}
      </p>
      <p class="text-xs text-muted-foreground">Checkbox value: {{ showAdditionalField }}</p>
      <p class="text-xs text-muted-foreground">Tekst: "{{ formValues.additionalText || '' }}"</p>
      <p class="text-xs text-muted-foreground">
        All form values: {{ JSON.stringify(form.values) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'vue-sonner'

// Schema walidacji
const formSchema = toTypedSchema(
  z.object({
    showAdditionalField: z.boolean().default(false),
    additionalText: z.string().optional(),
  }),
)

// Reactive refs
const showAdditionalField = ref(false)

// Formularz setup
const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    additionalText: '',
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
      form.setFieldValue('additionalText', '')
    }
  },
)

// Submit handler
const onSubmit = form.handleSubmit((values) => {
  console.log('Form values:', values)

  // Use form values directly since they're now synced
  const formData = {
    showAdditionalField: values.showAdditionalField,
    additionalText: values.additionalText,
  }

  console.log('Final formData:', formData)

  toast({
    title: 'Formularz wysłany!',
    description: `Checkbox: ${formData.showAdditionalField ? 'zaznaczony' : 'odznaczony'}, Tekst: "${formData.additionalText}"`,
  })

  // Tutaj możesz dodać logikę wysyłania danych do API
  // await submitToAPI(formData)
})
</script>
