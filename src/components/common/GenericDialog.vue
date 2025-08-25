<script setup lang="ts">
import { computed } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-vue-next'
import type { DialogModel } from '@/types/dialog'
import { DialogType } from '@/types/dialog'

interface Props {
  open: boolean
  dialog: DialogModel | null
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const dialogOpen = computed({
  get: () => props.open,
  set: (value) => {
    if (!value) {
      handleClose()
    }
  },
})

const handleClose = () => {
  if (props.dialog?.onCancel) {
    props.dialog.onCancel()
  }
  emit('close')
}

const handleAccept = async () => {
  if (props.dialog?.onAccept) {
    await props.dialog.onAccept()
  }
  emit('close')
}

const getIcon = computed(() => {
  switch (props.dialog?.type) {
    case DialogType.ERROR:
      return XCircle
    case DialogType.WARNING:
      return AlertTriangle
    case DialogType.SUCCESS:
      return CheckCircle
    case DialogType.CONFIRM:
      return AlertTriangle
    default: // ALERT
      return Info
  }
})

const getIconColor = computed(() => {
  switch (props.dialog?.type) {
    case DialogType.ERROR:
      return 'text-red-500'
    case DialogType.WARNING:
      return 'text-yellow-500'
    case DialogType.SUCCESS:
      return 'text-green-500'
    case DialogType.CONFIRM:
      return 'text-blue-500'
    default: // ALERT
      return 'text-blue-500'
  }
})

const getButtonVariant = computed(() => {
  switch (props.dialog?.type) {
    case DialogType.ERROR:
    case DialogType.CONFIRM:
      return 'destructive'
    default:
      return 'default'
  }
})

const showAcceptButton = computed(() => {
  return props.dialog?.type === DialogType.CONFIRM || props.dialog?.onAccept
})

const getDefaultAcceptText = computed(() => {
  switch (props.dialog?.type) {
    case DialogType.CONFIRM:
      return 'Confirm'
    case DialogType.ERROR:
      return 'OK'
    case DialogType.WARNING:
      return 'OK'
    case DialogType.SUCCESS:
      return 'OK'
    default: // ALERT
      return 'OK'
  }
})

const getDefaultCancelText = computed(() => {
  switch (props.dialog?.type) {
    case DialogType.CONFIRM:
      return 'Cancel'
    default:
      return 'Close'
  }
})
</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <component :is="getIcon" :class="['w-5 h-5', getIconColor]" />
          {{ dialog?.title || 'Dialog' }}
        </DialogTitle>
        <DialogDescription v-if="dialog?.message">
          {{ dialog.message }}
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <Button variant="outline" @click="handleClose">
          {{ dialog?.cancelText || getDefaultCancelText }}
        </Button>
        <Button 
          v-if="showAcceptButton"
          @click="handleAccept"
          :variant="getButtonVariant"
        >
          {{ dialog?.acceptText || getDefaultAcceptText }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>