<!-- components/Odontogram.vue -->
<template>
  <div class="w-full">
    <!-- Controls -->
    <OdontogramControls
      :selectedProcedure="selectedProcedure"
      :palette="procedurePalette"
      :targetMap="procedureTargetMap"
      :search="search"
      :isProcedureMissing="isProcedureMissing"
      @select="handleProcedureSelect"
      @clear="setSelectedProcedure(null)"
      @search-change="setSearch"
    />

    <!-- Dental Chart -->
    <Card class="mt-4 p-5" :style="{ width: `${containerWidth + quadrantGap + 40}px` }">
      <div :style="{ width: `${containerWidth + quadrantGap}px` }">
        <!-- Upper row - Q1 and Q2 -->
        <div
          class="flex mb-2"
          :style="{
            gap: `${quadrantGap}px`,
            marginLeft: `${upperRowLeftMargin}px`,
          }"
        >
          <Quadrant
            :teeth="q1teeth"
            :selectedSegments="selectedSegments"
            :selectedToothNumbers="selectedToothNumbers"
            :direction="ToothContainerDirection.Top"
            side="left"
            @segment-click="handleSegmentClick"
            @tooth-click="handleToothClick"
            @remove-tooth="handleRemoveTooth"
            @add-extra-tooth="handleAddExtraTooth"
          />
          <Quadrant
            :teeth="q2teeth"
            :selectedSegments="selectedSegments"
            :selectedToothNumbers="selectedToothNumbers"
            :direction="ToothContainerDirection.Top"
            side="right"
            @segment-click="handleSegmentClick"
            @tooth-click="handleToothClick"
            @remove-tooth="handleRemoveTooth"
            @add-extra-tooth="handleAddExtraTooth"
          />
        </div>

        <!-- Lower row - Q4 and Q3 -->
        <div
          class="flex"
          :style="{
            gap: `${quadrantGap}px`,
            marginLeft: `${lowerRowLeftMargin}px`,
          }"
        >
          <Quadrant
            :teeth="q4teeth"
            :selectedSegments="selectedSegments"
            :selectedToothNumbers="selectedToothNumbers"
            :direction="ToothContainerDirection.Bottom"
            side="left"
            @segment-click="handleSegmentClick"
            @tooth-click="handleToothClick"
            @remove-tooth="handleRemoveTooth"
            @add-extra-tooth="handleAddExtraTooth"
          />
          <Quadrant
            :teeth="q3teeth"
            :selectedSegments="selectedSegments"
            :selectedToothNumbers="selectedToothNumbers"
            :direction="ToothContainerDirection.Bottom"
            side="right"
            @segment-click="handleSegmentClick"
            @tooth-click="handleToothClick"
            @remove-tooth="handleRemoveTooth"
            @add-extra-tooth="handleAddExtraTooth"
          />
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Card } from '@/components/ui/card'
import { useOdontogram } from '@/composables/odontogram/useOdontogram'
import { ToothContainerDirection } from '@/types/odontogram/odontogram'
import OdontogramControls from '@/components/odontogram/OdontogramControls.vue'
import Quadrant from '@/components/odontogram/Quadrant.vue'

const {
  selectedProcedure,
  search,
  selectedSegments,
  selectedToothNumbers,
  teeth,
  isProcedureMissing,
  q1teeth,
  q2teeth,
  q3teeth,
  q4teeth,
  procedureTargetMap,
  procedurePalette,
  handleSegmentClick,
  handleToothClick,
  handleRemoveTooth,
  handleAddExtraTooth,
  handleProcedureSelect,
  setSelectedProcedure,
  setSearch,
} = useOdontogram()

const TOOTH_WIDTH = 70
const quadrantGap = 80

// Calculate layout dimensions
const q1Width = computed(() => q1teeth.value.length * TOOTH_WIDTH)
const q2Width = computed(() => q2teeth.value.length * TOOTH_WIDTH)
const q3Width = computed(() => q3teeth.value.length * TOOTH_WIDTH)
const q4Width = computed(() => q4teeth.value.length * TOOTH_WIDTH)

const upperMeetingPoint = computed(() => q1Width.value)
const lowerMeetingPoint = computed(() => q4Width.value)
const alignedMeetingPoint = computed(() =>
  Math.max(upperMeetingPoint.value, lowerMeetingPoint.value),
)

const upperRowLeftMargin = computed(() => alignedMeetingPoint.value - q1Width.value)
const lowerRowLeftMargin = computed(() => alignedMeetingPoint.value - q4Width.value)

const containerWidth = computed(
  () => alignedMeetingPoint.value + Math.max(q2Width.value, q3Width.value),
)
</script>
