<template>
  <Card>
    <CardHeader>
      <CardTitle>Icon Sources Demo</CardTitle>
      <CardDescription>
        Demonstrating how the system handles multiple icon sources
      </CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <!-- Available Icon Sources -->
      <div>
        <Label class="text-sm font-medium">Available Icon Sources:</Label>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          <div
            v-for="source in availableIconSources"
            :key="source.value"
            class="flex items-center gap-2 p-2 border rounded-md"
          >
            <Badge variant="outline" class="text-xs">
              {{ source.label }}
            </Badge>
            <span class="text-xs text-muted-foreground">
              {{ source.value }}
            </span>
          </div>
        </div>
      </div>

      <!-- Icon Source Selector -->
      <div>
        <Label class="text-sm font-medium">Select Icon Source:</Label>
        <Select v-model="selectedIconSource" class="mt-2">
          <SelectTrigger>
            <SelectValue placeholder="Choose an icon source..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="source in availableIconSources"
              :key="source.value"
              :value="source.value"
            >
              {{ source.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Icon Display -->
      <div v-if="selectedIconSource" class="p-4 border rounded-lg">
        <div class="flex items-center gap-3">
          <div class="text-2xl">
            <ProcedureIcon
              icon-name="Star"
              :icon-source="selectedIconSource"
            />
          </div>
          <div>
            <p class="font-medium">{{ getIconSourceName(selectedIconSource) }}</p>
            <p class="text-sm text-muted-foreground">
              Value: {{ selectedIconSource }}
            </p>
          </div>
        </div>
      </div>

      <!-- Add New Icon Source -->
      <div class="border-t pt-4">
        <Label class="text-sm font-medium">Add New Icon Source:</Label>
        <div class="flex gap-2 mt-2">
          <Input
            v-model="newIconSource"
            placeholder="e.g., 'bootstrap'"
            class="flex-1"
          />
          <Button @click="addIconSource" :disabled="!newIconSource">
            Add
          </Button>
        </div>
        <p class="text-xs text-muted-foreground mt-1">
          This demonstrates how easy it is to extend the system
        </p>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProcedureIconSource } from '@/types/odontogram/odontogram'
import { getIconSourceName, getAvailableIconSources } from '@/utils/iconUtils'
import ProcedureIcon from './ProcedureIcon.vue'

// State
const selectedIconSource = ref<ProcedureIconSource>(ProcedureIconSource.Lucide)
const newIconSource = ref('')

// Computed
const availableIconSources = computed(() => getAvailableIconSources())

// Methods
const addIconSource = () => {
  if (newIconSource.value) {
    console.log('Adding new icon source:', newIconSource.value)
    // In a real implementation, you would:
    // 1. Add the new source to the enum
    // 2. Update the utility functions
    // 3. Add corresponding icon components
    alert(`New icon source "${newIconSource.value}" would be added to the system`)
    newIconSource.value = ''
  }
}
</script> 