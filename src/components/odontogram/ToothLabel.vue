<!-- components/ToothLabel.vue -->
<template>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <div class="w-full cursor-pointer select-none flex items-center justify-center" @click.stop>
        {{ toothNumber }}
      </div>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="start" @click.stop>
      <DropdownMenuItem v-if="!isExtra" @click="$emit('add-extra-before')">
        Dodaj ząb nadliczbowy przed ({{ generateExtraToothNumber(toothNumber, 'before') }})
      </DropdownMenuItem>

      <DropdownMenuItem v-if="!isExtra" @click="$emit('add-extra-after')">
        Dodaj ząb nadliczbowy za ({{ generateExtraToothNumber(toothNumber, 'after') }})
      </DropdownMenuItem>

      <DropdownMenuItem v-if="isExtra" @click="$emit('remove-tooth')"> Usuń ząb </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Props {
  toothNumber: string
  isExtra: boolean
}

interface Emits {
  (e: 'add-extra-before'): void
  (e: 'add-extra-after'): void
  (e: 'remove-tooth'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const generateExtraToothNumber = (base: string, direction: 'before' | 'after'): string => {
  const suffix = direction === 'before' ? '-1' : '+1'
  return `${base}${suffix}`
}
</script>
