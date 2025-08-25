import { ref, reactive } from 'vue'
import type { DialogModel, DialogState } from '@/types/dialog'
import { DialogType } from '@/types/dialog'

// Global dialog state
const dialogState = reactive<DialogState>({
  open: false,
  dialog: null,
})

export function useDialog() {
  const showDialog = (options: {
    type: DialogType
    title: string
    message: string
    acceptText?: string
    cancelText?: string
    onAccept?: () => void | Promise<void>
    onCancel?: () => void
  }) => {
    dialogState.dialog = {
      type: options.type,
      title: options.title,
      message: options.message,
      acceptText: options.acceptText,
      cancelText: options.cancelText,
      onAccept: options.onAccept,
      onCancel: options.onCancel,
    }
    dialogState.open = true
  }

  const hideDialog = () => {
    dialogState.open = false
    dialogState.dialog = null
  }

  // Convenience methods for different dialog types
  const confirm = (options: {
    title: string
    message: string
    acceptText?: string
    cancelText?: string
    onAccept?: () => void | Promise<void>
    onCancel?: () => void
  }) => showDialog({ ...options, type: DialogType.CONFIRM })

  const alert = (options: {
    title: string
    message: string
    acceptText?: string
  }) => showDialog({ ...options, type: DialogType.ALERT })

  const error = (options: {
    title?: string
    message: string
    acceptText?: string
  }) => showDialog({ 
    ...options, 
    type: DialogType.ERROR,
    title: options.title || 'Error'
  })

  const warning = (options: {
    title: string
    message: string
    acceptText?: string
  }) => showDialog({ ...options, type: DialogType.WARNING })

  const success = (options: {
    title: string
    message: string
    acceptText?: string
  }) => showDialog({ ...options, type: DialogType.SUCCESS })

  return {
    dialogState,
    showDialog,
    hideDialog,
    confirm,
    alert,
    error,
    warning,
    success,
  }
}