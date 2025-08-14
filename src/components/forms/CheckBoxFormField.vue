<template>
  <FormField v-slot="{ componentField }" :name="name">
    <FormItem>
      <div class="flex flex-row items-start space-x-3 space-y-0">
        <FormControl>
          <Checkbox
            :id="name"
            :checked="componentField.modelValue"
            @update:checked="componentField['onUpdate:modelValue']"
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
</template>

<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'

interface Props {
  name: string
  label: string
}

defineProps<Props>()
</script>