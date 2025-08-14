<template>
  <div class="space-y-3">
    <!-- Checkbox Field -->
    <FormField v-slot="{ componentField }" :name="name">
      <FormItem>
        <div class="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              :id="name"
              :checked="componentField.modelValue"
              @click="
                () => {
                  const newValue = !componentField.modelValue
                  componentField['onUpdate:modelValue']?.(newValue)
                  checkboxState = newValue
                }
              "
              @update:checked="
                (value: boolean) => {
                  componentField['onUpdate:modelValue']?.(value)
                  checkboxState = value
                }
              "
            />
          </FormControl>
          <div class="space-y-1 leading-none">
            <Label :for="name" class="text-sm font-medium cursor-pointer">
              {{ checkboxLabel }}
            </Label>
          </div>
        </div>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Conditional Text Field -->
    <FormField
      v-if="checkboxState"
      v-slot="{ componentField: textComponentField }"
      :name="textFieldName"
    >
      <FormItem>
        <FormLabel>{{ textFieldLabel }}</FormLabel>
        <FormControl>
          <Textarea
            v-bind="textComponentField"
            :placeholder="textFieldPlaceholder"
            type="text"
            class="max-w-xl"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  name: string
  checkboxLabel: string
  textFieldLabel: string | null
  textFieldPlaceholder: string | null
}

const props = withDefaults(defineProps<Props>(), {
  textFieldPlaceholder: 'Wpisz dodatkowe informacje...',
})

// Simple reactive state for checkbox
const checkboxState = ref(false)

const textFieldName = computed(() => {
  // Handle nested paths like "medicalHistory.allergies" -> "medicalHistory.allergiesDescription"
  const parts = props.name.split('.')
  if (parts.length > 1) {
    const lastPart = parts[parts.length - 1]
    parts[parts.length - 1] = `${lastPart}Description`
    return parts.join('.')
  }
  return `${props.name}Description`
})
</script>
