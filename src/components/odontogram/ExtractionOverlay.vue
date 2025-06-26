<!-- components/ExtractionOverlay.vue -->
<template>
  <div
    class="absolute top-0 left-0 w-full h-full pointer-events-none text-red-500 flex items-center justify-center z-[5]"
  >
    <X class="w-full h-full" />
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'
</script>
