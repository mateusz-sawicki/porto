<template>
  <FormField v-slot="{ componentField }" :name="name">
    <FormItem>
      <FormLabel v-if="label">{{ label }}</FormLabel>
      <FormControl>
        <Textarea v-bind="componentField" :placeholder="placeholder" class="max-w-xl" />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
</template>

<script setup lang="ts">
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  name: string
  label?: string
  placeholder?: string
  className?: string
}

withDefaults(defineProps<Props>(), {})
</script>
