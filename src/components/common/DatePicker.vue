<script setup lang="ts">
import { computed, ref } from 'vue'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { CalendarDate, type DateValue } from '@internationalized/date'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface Props {
  modelValue?: Date | null | undefined
  placeholder?: string
  disabled?: boolean
  class?: string
}

interface Emits {
  (e: 'update:modelValue', value: Date | undefined): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Pick a date',
})

const emit = defineEmits<Emits>()

const open = ref(false)

// Convert Date to DateValue for the calendar
const dateValue = computed(() => {
  if (!props.modelValue) return undefined
  const date = props.modelValue
  return new CalendarDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
})

const displayValue = computed(() => {
  if (props.modelValue) {
    const day = props.modelValue.getDate().toString().padStart(2, '0')
    const month = (props.modelValue.getMonth() + 1).toString().padStart(2, '0')
    const year = props.modelValue.getFullYear()
    return `${day}.${month}.${year}`
  }
  return props.placeholder
})

const handleDateSelect = (dateVal: DateValue | undefined) => {
  if (!dateVal) {
    emit('update:modelValue', undefined)
  } else {
    // Convert DateValue back to Date
    const date = new Date(dateVal.year, dateVal.month - 1, dateVal.day)
    emit('update:modelValue', date)
    open.value = false // Close the popover
  }
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="
          cn(
            'w-full justify-start text-left font-normal',
            !props.modelValue && 'text-muted-foreground',
            props.class,
          )
        "
        :disabled="props.disabled"
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{ displayValue }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0" align="start">
      <Calendar :model-value="dateValue" @update:model-value="handleDateSelect" />
    </PopoverContent>
  </Popover>
</template>
