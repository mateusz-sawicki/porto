export enum DialogType {
  ALERT = 'alert',
  CONFIRM = 'confirm',
  ERROR = 'error',
  WARNING = 'warning',
  SUCCESS = 'success'
}

export interface DialogModel {
  type: DialogType
  title: string
  message: string
  acceptText?: string
  cancelText?: string
  onAccept?: () => void | Promise<void>
  onCancel?: () => void
}

export interface DialogState {
  open: boolean
  dialog: DialogModel | null
}