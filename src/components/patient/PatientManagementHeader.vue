<script setup lang="ts">
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Database, Plus } from 'lucide-vue-next'

interface Props {
  loading: boolean
}

interface Emits {
  (e: 'add-patient'): void
  (e: 'refresh'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <CardHeader>
    <div class="flex items-center justify-between">
      <div>
        <CardTitle class="flex items-center gap-2"> Patient Management </CardTitle>
        <CardDescription>
          Manage your dental practice patients with advanced filtering and sorting
        </CardDescription>
      </div>
      <div class="flex items-center gap-2">
        <Button @click="$emit('add-patient')">
          <Plus class="h-4 w-4 mr-2" />
          Add Patient
        </Button>
        <Button variant="outline" size="sm" :disabled="loading" @click="$emit('refresh')">
          <RefreshCw class="h-4 w-4 mr-2" :class="{ 'animate-spin': loading }" />
          Refresh
        </Button>
      </div>
    </div>
  </CardHeader>
</template>
