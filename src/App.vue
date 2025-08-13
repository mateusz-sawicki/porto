<script setup lang="ts">
import AppShell from '@/components/layout/AppShell.vue'
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css' // vue-sonner v2 requires this import
</script>

<template>
  <Toaster class="pointer-events-auto" />
  <AppShell />
</template>
