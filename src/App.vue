<script setup lang="ts">
import AppShell from '@/components/layout/AppShell.vue'
import { Toaster } from '@/components/ui/sonner'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
import GenericDialog from '@/components/common/GenericDialog.vue'
import { useDialog } from '@/composables/useDialog'
import 'vue-sonner/style.css' // vue-sonner v2 requires this import

const { dialogState, hideDialog } = useDialog()
</script>

<template>
  <Toaster class="pointer-events-auto" />
  <AppShell />
  <LoadingOverlay />
  <GenericDialog 
    :open="dialogState.open" 
    :dialog="dialogState.dialog" 
    @close="hideDialog" 
  />
</template>
