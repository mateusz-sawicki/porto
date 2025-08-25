<script setup lang="ts">
import { useOverlay } from '@/composables/useApiCall'

const overlayState = useOverlay()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="overlayState.visible"
      class="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center"
    >
      <div class="bg-white rounded-lg p-6 shadow-lg max-w-sm mx-4">
        <div class="flex items-center space-x-3">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span class="text-sm text-gray-700">{{ overlayState.message }}</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>