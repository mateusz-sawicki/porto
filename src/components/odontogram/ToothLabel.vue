<!-- components/ToothLabel.vue -->
<template>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <div
        class="tooth-label-button"
        :class="{
          'tooth-label-button--top': direction === ToothContainerDirection.Top,
          'tooth-label-button--bottom': direction === ToothContainerDirection.Bottom,
        }"
        @click.stop
      >
        {{ toothNumber }}
      </div>
    </DropdownMenuTrigger>

    <DropdownMenuContent>
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
import { ToothContainerDirection } from '@/types/odontogram/odontogram'

interface Props {
  toothNumber: string
  isExtra: boolean
  direction: ToothContainerDirection
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

<style scoped>
.tooth-label-button {
  /* High z-index to cover roots */
  position: relative;
  z-index: 30;

  /* Match ToothContainer styling */
  background-color: var(--background);

  /* Size and spacing - match ToothContainer width */
  width: 88px;
  min-height: 29px;

  /* Layout */
  display: flex;
  align-items: center;
  justify-content: center;

  /* Text styling */
  font-size: 16px;
  font-weight: 500;
  color: var(--foreground);

  /* Interaction */
  cursor: pointer;
  user-select: none;

  /* Visual effects - match ToothContainer transitions */
  transition: background-color 0.2s ease;
}

/* 🎯 Position adjustments based on quadrant */
.tooth-label-button--top {
  top: 1px;
}

.tooth-label-button--bottom {
  top: -1px;
}

.tooth-label-button:hover {
  background-color: var(--muted);
}

/* Optional: If you want active/pressed state similar to selected tooth */
.tooth-label-button:active {
  background-color: var(--muted);
  outline-color: var(--primary);
}
</style>
