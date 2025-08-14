<template>
  <FormField v-slot="{ componentField }" :name="name">
    <FormItem>
      <div class="flex items-center space-x-4">
        <FormLabel v-if="label" class="text-sm font-medium whitespace-nowrap">{{ label }}</FormLabel>
        <FormControl>
          <RadioGroup v-bind="componentField" class="!flex !flex-row !gap-4">
            <div
              v-for="option in options"
              :key="option.value"
              class="flex items-center space-x-2"
            >
              <RadioGroupItem :value="option.value" :id="option.value" />
              <Label :for="option.value">{{ option.label }}</Label>
            </div>
          </RadioGroup>
        </FormControl>
      </div>
      <FormMessage />
    </FormItem>
  </FormField>
</template>

<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface Option {
  value: string
  label: string
}

interface Props {
  name: string
  label?: string
  options: Option[]
}

defineProps<Props>()
</script>