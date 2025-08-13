<template>
  <div class="space-y-3">
    <!-- Checkbox Field -->
    <div class="flex flex-row items-start space-x-3 space-y-0">
      <Checkbox v-model="isChecked" :id="name" />
      <div class="space-y-1 leading-none">
        <Label :for="name" class="text-sm font-medium cursor-pointer">
          {{ checkboxLabel }}
        </Label>
      </div>
    </div>

    <!-- Conditional Text Field -->
    <FormField v-if="isChecked" v-slot="{ componentField }" :name="textFieldName">
      <FormItem>
        <FormLabel>{{ textFieldLabel }}</FormLabel>
        <FormControl>
          <Input
            v-bind="componentField"
            :placeholder="textFieldPlaceholder"
            class="transition-all duration-200"
            type="text"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface Props {
  name: string
  checkboxLabel: string
  textFieldLabel: string
  textFieldPlaceholder?: string
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  textFieldPlaceholder: 'Wpisz dodatkowe informacje...'
})

const emit = defineEmits<Emits>()

const isChecked = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const textFieldName = computed(() => `${props.name}Description`)
</script>