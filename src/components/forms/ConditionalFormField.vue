<template>
  <div class="space-y-3">
    <!-- Main Checkbox Field -->
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
              {{ label }}
            </Label>
          </div>
        </div>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Conditional Fields -->
    <template v-if="checkboxState">
      <!-- Loop through all conditional fields -->
      <template v-for="(conditionalField, index) in conditionalFields" :key="index">
        <!-- Textarea Field -->
        <TextareaFormField
          v-if="conditionalField.type === 'textarea'"
          :name="getConditionalFieldName(index)"
          :label="conditionalField.label"
          :placeholder="conditionalField.placeholder"
        />

        <!-- Radio Group Field -->
        <RadioFormField
          v-else-if="conditionalField.type === 'radio'"
          :name="getConditionalFieldName(index)"
          :label="conditionalField.label"
          :options="conditionalField.options!"
        />

        <!-- Select Field -->
        <FormField
          v-else-if="conditionalField.type === 'select'"
          v-slot="{ componentField }"
          :name="getConditionalFieldName(index)"
        >
          <FormItem>
            <FormLabel v-if="conditionalField.label">{{ conditionalField.label }}</FormLabel>
            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger class="max-w-xl">
                  <SelectValue :placeholder="conditionalField.placeholder" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem
                  v-for="option in conditionalField.options"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Nested Conditional Field -->
        <ConditionalFormField
          v-else-if="conditionalField.type === 'conditionalField'"
          :name="getConditionalFieldName(index)"
          :label="conditionalField.label || ''"
          :conditional-fields="conditionalField.conditionalFields!"
        />

        <!-- Multiple Checkbox Field -->
        <FormField
          v-else-if="conditionalField.type === 'multichoice'"
          v-slot="{ componentField }"
          :name="getConditionalFieldName(index)"
          class="space-y-3"
        >
          <FormItem>
            <FormLabel v-if="conditionalField.label">{{ conditionalField.label }}</FormLabel>
            <div class="space-y-2">
              <div
                v-for="option in conditionalField.options"
                :key="option.value"
                class="flex items-center space-x-2"
              >
                <Checkbox
                  :id="`${option.value}_${index}`"
                  :checked="(componentField.modelValue || []).includes(option.value)"
                  @update:checked="
                    (checked: boolean) => {
                      const currentValue = componentField.modelValue || []
                      if (checked) {
                        componentField['onUpdate:modelValue']?.([...currentValue, option.value])
                      } else {
                        componentField['onUpdate:modelValue']?.(
                          currentValue.filter((v: string) => v !== option.value),
                        )
                      }
                    }
                  "
                />
                <Label :for="`${option.value}_${index}`">{{ option.label }}</Label>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        </FormField>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-vue-next'
import CheckBoxFormField from './CheckBoxFormField.vue'
import TextareaFormField from './TextareaFormField.vue'
import RadioFormField from './RadioFormField.vue'

interface Option {
  value: string
  label: string
}

interface ConditionalFieldConfig {
  type: 'textarea' | 'select' | 'radio' | 'multichoice' | 'datepicker' | 'conditionalField'
  label?: string
  placeholder?: string
  options?: Option[]
  conditionalFields?: ConditionalFieldConfig[]
}

interface Props {
  name: string
  label: string
  conditionalFields: ConditionalFieldConfig[]
}

const props = defineProps<Props>()

// Simple reactive state for checkbox
const checkboxState = ref(false)

// Helper function to generate field name for a specific conditional field
const getConditionalFieldName = (index: number) => {
  const parts = props.name.split('.')
  if (parts.length > 1) {
    const lastPart = parts[parts.length - 1]
    const suffix = props.conditionalFields.length === 1 ? 'Value' : `Value${index + 1}`
    parts[parts.length - 1] = `${lastPart}${suffix}`
    return parts.join('.')
  }
  const suffix = props.conditionalFields.length === 1 ? 'Value' : `Value${index + 1}`
  return `${props.name}${suffix}`
}
</script>
