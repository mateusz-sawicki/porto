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

    <!-- Conditional Field -->
    <template v-if="checkboxState">
      <!-- Conditional Field Types -->
      <template v-if="conditionalField">
        <!-- Textarea Field -->
        <FormField
          v-if="conditionalField.type === 'textarea'"
          v-slot="{ componentField }"
          :name="conditionalFieldName"
        >
          <FormItem>
            <FormLabel v-if="conditionalField.label">{{ conditionalField.label }}</FormLabel>
            <FormControl>
              <Textarea
                v-bind="componentField"
                :placeholder="conditionalField.placeholder"
                class="max-w-xl"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Select Field -->
        <FormField
          v-if="conditionalField.type === 'select'"
          v-slot="{ componentField }"
          :name="conditionalFieldName"
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

        <!-- Radio Group Field -->
        <FormField
          v-if="conditionalField.type === 'radio'"
          v-slot="{ componentField }"
          :name="conditionalFieldName"
        >
          <FormItem class="space-y-3">
            <FormLabel v-if="conditionalField.label">{{ conditionalField.label }}</FormLabel>
            <FormControl>
              <RadioGroup v-bind="componentField" class="!flex !flex-row !gap-4">
                <div
                  v-for="option in conditionalField.options"
                  :key="option.value"
                  class="flex items-center space-x-2"
                >
                  <RadioGroupItem :value="option.value" :id="option.value" />
                  <Label :for="option.value">{{ option.label }}</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Multiple Checkbox Field -->
        <FormField
          v-if="conditionalField.type === 'multichoice'"
          v-slot="{ componentField }"
          :name="conditionalFieldName"
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
                  :id="option.value"
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
                <Label :for="option.value">{{ option.label }}</Label>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Date Picker Field -->
        <FormField
          v-if="conditionalField.type === 'datepicker'"
          v-slot="{ componentField }"
          :name="conditionalFieldName"
          class="space-y-3"
        >
          <FormItem class="flex flex-col">
            <FormLabel v-if="conditionalField.label">{{ conditionalField.label }}</FormLabel>
            <Popover>
              <PopoverTrigger as-child>
                <FormControl>
                  <Button
                    variant="outline"
                    :class="[
                      'max-w-xl justify-start text-left font-normal',
                      !componentField.modelValue && 'text-muted-foreground',
                    ]"
                  >
                    <CalendarIcon class="mr-2 h-4 w-4" />
                    {{
                      componentField.modelValue
                        ? new Date(componentField.modelValue).toLocaleDateString('pl-PL')
                        : conditionalField.placeholder || 'Wybierz datę'
                    }}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0" align="start">
                <Calendar
                  v-bind="componentField"
                  @update:model-value="(date: any) => componentField['onUpdate:modelValue']?.(date)"
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        </FormField>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-vue-next'

interface Option {
  value: string
  label: string
}

interface ConditionalFieldConfig {
  type: 'textarea' | 'select' | 'radio' | 'multichoice' | 'datepicker'
  label?: string
  placeholder?: string
  options?: Option[]
}

interface Props {
  name: string
  checkboxLabel: string
  conditionalField: ConditionalFieldConfig
}

const props = defineProps<Props>()

// Simple reactive state for checkbox
const checkboxState = ref(false)

const conditionalFieldName = computed(() => {
  const parts = props.name.split('.')
  if (parts.length > 1) {
    const lastPart = parts[parts.length - 1]
    parts[parts.length - 1] = `${lastPart}Value`
    return parts.join('.')
  }
  return `${props.name}Value`
})
</script>
