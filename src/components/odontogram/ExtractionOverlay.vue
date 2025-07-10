<!-- components/ExtractionOverlay.vue -->
<template>
  <div
    class="absolute left-0 w-full h-full pointer-events-none flex items-center justify-center z-[50]"
    :style="{ top: '32px', height: '248px' }"
  >
    <svg viewBox="0 0 90 248" class="w-full h-full" stroke="red" stroke-width="6" fill="none">
      <line x1="10" y1="10" x2="80" y2="238" />
      <line x1="80" y1="10" x2="10" y2="238" />
    </svg>
  </div>
</template>

<script setup lang="ts">
// No imports needed
</script>
