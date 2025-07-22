<template>
  <div class="container mx-auto p-6 space-y-6">
    <div class="space-y-2">
      <h1 class="text-3xl font-bold">Procedure Management</h1>
      <p class="text-muted-foreground">
        Test and manage dental procedures with enhanced selection and filtering capabilities.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Procedure Selector Demo -->
      <Card>
        <CardHeader>
          <CardTitle>Procedure Selector</CardTitle>
          <CardDescription>
            Enhanced procedure selection with categories, search, and target information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProcedureSelector
            v-model:selected-procedure="selectedProcedure"
            :selected-target="selectedTarget"
            @select="handleProcedureSelect"
          />
        </CardContent>
      </Card>

      <!-- Target Selection -->
      <Card>
        <CardHeader>
          <CardTitle>Target Selection</CardTitle>
          <CardDescription>
            Select a target to filter procedures that can be applied to it.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <Label>Select Target:</Label>
            <Select v-model="selectedTarget">
              <SelectTrigger>
                <SelectValue placeholder="Choose a target..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Targets</SelectItem>
                <SelectItem value="Tooth">Tooth</SelectItem>
                <SelectItem value="Crown">Crown</SelectItem>
                <SelectItem value="Root">Root</SelectItem>
                <SelectItem value="Mesial">Mesial</SelectItem>
                <SelectItem value="Distal">Distal</SelectItem>
                <SelectItem value="Buccal">Buccal</SelectItem>
                <SelectItem value="Lingual">Lingual</SelectItem>
                <SelectItem value="Incisal">Incisal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div v-if="selectedTarget" class="p-3 bg-muted rounded-lg">
            <h4 class="font-medium text-sm mb-2">Procedures for {{ selectedTarget }}:</h4>
            <div class="space-y-1">
              <div
                v-for="procedure in proceduresForTarget"
                :key="procedure.name"
                class="flex items-center gap-2 p-2 bg-background rounded border"
              >
                <div
                  v-if="procedure.visual.visualType === 'Color'"
                  class="w-4 h-4 rounded-sm"
                  :style="{ backgroundColor: procedure.visual.value }"
                />
                <ProcedureIcon
                  v-else-if="procedure.visual.visualType === 'Icon'"
                  :icon-name="procedure.visual.value!"
                  :icon-source="procedure.visual.iconSource"
                  class="w-4 h-4"
                />
                <span class="text-sm">{{ procedure.name }}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Selected Procedure Details -->
      <Card v-if="selectedProcedure" class="lg:col-span-2">
        <CardHeader>
          <CardTitle>Selected Procedure Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <div
                  v-if="selectedProcedure.visual.visualType === 'Color'"
                  class="w-8 h-8 rounded-sm border"
                  :style="{ backgroundColor: selectedProcedure.visual.value }"
                />
                <ProcedureIcon
                  v-else-if="selectedProcedure.visual.visualType === 'Icon'"
                  :icon-name="selectedProcedure.visual.value!"
                  :icon-source="selectedProcedure.visual.iconSource"
                  class="w-8 h-8"
                />
                <div>
                  <h3 class="font-semibold">{{ selectedProcedure.name }}</h3>
                </div>
              </div>

              <div v-if="selectedProcedure.description">
                <Label>Description:</Label>
                <p class="text-sm text-muted-foreground mt-1">
                  {{ selectedProcedure.description }}
                </p>
              </div>

              <div>
                <Label>Behavior:</Label>
                <Badge variant="secondary" class="mt-1">{{ selectedProcedure.behavior }}</Badge>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <Label>Available Targets:</Label>
                <div class="flex flex-wrap gap-1 mt-2">
                  <Badge v-for="target in availableTargets" :key="target" variant="outline">
                    {{ target }}
                  </Badge>
                </div>
              </div>

              <div>
                <Label>Visual Type:</Label>
                <div class="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{{ selectedProcedure.visual.visualType }}</Badge>
                  <span class="text-sm text-muted-foreground">
                    {{ selectedProcedure.visual.value }}
                  </span>
                </div>
              </div>

              <div v-if="selectedProcedure.visual.iconSource !== undefined">
                <Label>Icon Source:</Label>
                <Badge variant="outline" class="mt-1">
                  {{ getIconSourceName(selectedProcedure.visual.iconSource) }}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Procedure Statistics -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <CardTitle>Procedure Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold">{{ totalProcedures }}</div>
              <div class="text-sm text-muted-foreground">Total Procedures</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold">{{ activeProcedures }}</div>
              <div class="text-sm text-muted-foreground">Active Procedures</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold">{{ proceduresForTarget.length }}</div>
              <div class="text-sm text-muted-foreground">
                {{ selectedTarget ? `For ${selectedTarget}` : 'All Targets' }}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Icon Sources Demo -->
      <IconSourceDemo class="lg:col-span-2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ProcedureWithTarget } from '@/services/procedure/procedureApi'
import { getIconSourceName } from '@/utils/iconUtils'
import ProcedureSelector from '@/components/odontogram/ProcedureSelector.vue'
import ProcedureIcon from '@/components/odontogram/ProcedureIcon.vue'
import IconSourceDemo from '@/components/odontogram/IconSourceDemo.vue'
import { useProcedures } from '@/composables/procedure/useProcedures'

// State
const selectedProcedure = ref<ProcedureWithTarget | null>(null)
const selectedTarget = ref<string>('')

// Use procedures composable
const { procedures, getProceduresForTarget, getAvailableTargets } = useProcedures()

// Computed
const totalProcedures = computed(() => procedures.value.length)
const activeProcedures = computed(() => procedures.value.filter((p) => p.isActive !== false).length)

const proceduresForTarget = computed(() => {
  if (!selectedTarget.value) return procedures.value
  return getProceduresForTarget(selectedTarget.value)
})

const availableTargets = computed(() => {
  if (!selectedProcedure.value) return []
  return getAvailableTargets(selectedProcedure.value)
})

// Methods
const handleProcedureSelect = (procedure: ProcedureWithTarget) => {
  selectedProcedure.value = procedure
  console.log('Selected procedure:', procedure)
}
</script>
