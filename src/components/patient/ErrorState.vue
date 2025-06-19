<script setup lang="ts">
import { Button } from '@/components/ui/button'

interface Props {
  error: string
}

interface Emits {
  (e: 'retry'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <div class="text-center py-8">
    <div class="flex items-center justify-center text-red-600 mb-4">
      <span class="mr-2">⚠️</span>
      <span>{{ error }}</span>
    </div>
    <Button variant="outline" @click="$emit('retry')"> Try Again </Button>
  </div>
</template>
