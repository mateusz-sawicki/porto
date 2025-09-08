<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Plus class="w-5 h-5" />
          New Treatment Plan
        </DialogTitle>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid gap-2">
          <Label for="treatment-plan-name">Treatment Plan Name</Label>
          <Input
            id="treatment-plan-name"
            v-model="name"
            placeholder="Enter treatment plan name"
            :disabled="isCreating"
          />
        </div>
        <div class="flex items-center space-x-2">
          <Checkbox
            id="is-pediatric"
            :checked="isChild"
            @update:checked="(checked: boolean) => (isChild = checked)"
            :disabled="isCreating"
          />
          <Label
            for="is-pediatric"
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Is pediatric?
          </Label>
        </div>
      </div>
      <DialogFooter>
        <Button
          variant="outline"
          @click="handleCancel"
          :disabled="isCreating"
        >
          Cancel
        </Button>
        <Button
          @click="handleSave"
          :disabled="!name.trim() || isCreating"
        >
          {{ isCreating ? 'Creating...' : 'Create Treatment Plan' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-vue-next'

interface TreatmentPlanData {
  name: string
  isChild: boolean
}

const props = defineProps<{
  open: boolean
  isCreating?: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  save: [data: TreatmentPlanData]
  cancel: []
}>()

const name = ref('')
const isChild = ref(false)

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

const handleSave = () => {
  if (!name.value.trim()) return
  
  emit('save', {
    name: name.value.trim(),
    isChild: isChild.value
  })
}

const handleCancel = () => {
  emit('cancel')
}

// Reset form when dialog closes
watch(() => props.open, (newValue) => {
  if (!newValue) {
    name.value = ''
    isChild.value = false
  }
})
</script>