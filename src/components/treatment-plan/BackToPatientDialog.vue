<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <ArrowLeft class="w-5 h-5" />
          Back to Patient
        </DialogTitle>
        <DialogDescription>
          You have unsaved changes. What would you like to do?
        </DialogDescription>
      </DialogHeader>

      <div class="flex flex-col gap-3 py-4">
        <Button
          @click="handleSaveAndExit"
          :disabled="isProcessing"
          class="flex items-center justify-center gap-2"
        >
          <Save class="w-4 h-4" />
          {{ isProcessing ? 'Saving...' : 'Save and Return to Patient' }}
        </Button>

        <Button
          variant="outline"
          @click="handleExitWithoutSave"
          :disabled="isProcessing"
          class="flex items-center justify-center gap-2"
        >
          <X class="w-4 h-4" />
          Return Without Saving
        </Button>

        <Button
          variant="ghost"
          @click="handleCancel"
          :disabled="isProcessing"
        >
          Cancel
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ArrowLeft, Save, X } from 'lucide-vue-next'

const props = defineProps<{
  open: boolean
  isProcessing?: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'save-and-exit': []
  'exit-without-save': []
  'cancel': []
}>()

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

const handleSaveAndExit = () => {
  emit('save-and-exit')
}

const handleExitWithoutSave = () => {
  emit('exit-without-save')
}

const handleCancel = () => {
  emit('cancel')
}
</script>