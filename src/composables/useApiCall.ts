import { ref, readonly, type Ref } from 'vue'

export interface ApiCallOptions {
  withOverlay?: boolean
  overlayMessage?: string
}

interface UseApiCallReturn {
  loading: Readonly<Ref<boolean>>
  execute: <T>(apiFunction: () => Promise<T>, options?: ApiCallOptions) => Promise<T | null>
}

export function useApiCall(): UseApiCallReturn {
  const loading = ref(false)

  const execute = async <T>(
    apiFunction: () => Promise<T>,
    options: ApiCallOptions = {},
  ): Promise<T | null> => {
    const { withOverlay = false, overlayMessage = 'Loading...' } = options

    try {
      loading.value = true

      // Show overlay if requested
      if (withOverlay) {
        showOverlay(overlayMessage)
      }

      const result = await apiFunction()
      return result
    } catch (error) {
      console.error('API call failed:', error)
      // Handle error (could emit error event or throw)
      throw error
    } finally {
      loading.value = false
      if (withOverlay) {
        hideOverlay()
      }
    }
  }

  return {
    loading: readonly(loading),
    execute,
  }
}

// Global overlay state
const overlayState = ref({
  visible: false,
  message: 'Loading...',
})

export const useOverlay = () => overlayState

// Always prevent dialog interactions when overlay is visible
export const preventDialogClose = (event: Event) => {
  console.log('preventDialogClose called, overlay visible:', overlayState.value.visible)
  if (overlayState.value.visible) {
    console.log('Preventing dialog close!')
    event.preventDefault()
    return false
  }
}

const showOverlay = (message: string) => {
  overlayState.value = {
    visible: true,
    message,
  }
}

const hideOverlay = () => {
  overlayState.value = {
    visible: false,
    message: 'Loading...',
  }
}
