<!-- components/ToothContainer.vue - Schematic Moved to End with Margin -->
<template>
  <Popover :open="showTooltip">
    <PopoverTrigger asChild>
      <div
        class="tooth-wrapper"
        :class="{
          selected: isSelected,
          'tooth-wrapper--hidden': hideTooth,
        }"
        @click="handleToothClick"
        @mouseenter="hoveredTooth = tooth.number"
        @mouseleave="hoveredTooth = null"
      >
        <!-- Main Group Container (equivalent to Mantine's Group with h={280}) -->
        <div
          class="tooth-group"
          :class="{
            'tooth-group--bottom': direction === ToothContainerDirection.Bottom,
          }"
        >
          <template v-if="direction === ToothContainerDirection.Top">
            <ToothLabel
              :toothNumber="tooth.number"
              :isExtra="isExtra"
              :direction="direction"
              @add-extra-before="
                $emit('add-extra-tooth', {
                  base: tooth.number,
                  direction: ExtraToothDirection.Before,
                })
              "
              @add-extra-after="
                $emit('add-extra-tooth', {
                  base: tooth.number,
                  direction: ExtraToothDirection.After,
                })
              "
              @remove-tooth="$emit('remove-tooth', tooth.number)"
            />

            <!-- Single wrapper for tooth components (Schematic moved out) -->
            <div class="tooth-components-wrapper" :class="{ 'extraction-blocked': !!extraction }">
              <GumOverlay :direction="direction" :hasCutout="hasExposedToothProcedure" />
              <template v-if="!hideTooth">
                <template v-if="rootOnly">
                  <!-- 🎯 Clipping container specifically for tooth -->
                  <div class="tooth-clip-container">
                    <div
                      class="tooth-only-wrapper"
                      :class="{ 'impacted-tooth--top': isImpactedTooth }"
                    >
                      <Tooth
                        :number="tooth.number"
                        :toothProcedures="tooth.toothProcedures"
                        :selectedSegments="extraction ? [] : selectedSegments"
                        :direction="direction"
                        only-root
                        @segment-click="handleSegmentClick"
                      />
                    </div>
                  </div>
                </template>
                <template v-else>
                  <!-- 🎯 Clipping container specifically for tooth -->
                  <div class="tooth-clip-container">
                    <div
                      class="tooth-only-wrapper"
                      :class="{ 'impacted-tooth--top': isImpactedTooth }"
                    >
                      <Tooth
                        :number="tooth.number"
                        :toothProcedures="tooth.toothProcedures"
                        :selectedSegments="extraction ? [] : selectedSegments"
                        :direction="direction"
                        @segment-click="handleSegmentClick"
                      />
                    </div>
                  </div>
                </template>
              </template>
              <!-- Single hover blocker for all components -->
              <div v-if="extraction" class="hover-blocker"></div>
            </div>

            <!-- 🎯 Schematic moved to end with margin -->
            <template v-if="!hideTooth && !rootOnly">
              <div class="schematic-at-end">
                <IconOverlay v-if="toothLevelObservation" :direction="direction" position="tooth">
                  <Eye class="w-5 h-5 text-blue-600 opacity-80" />
                </IconOverlay>
                <Schematic
                  :number="tooth.number"
                  :schemaProcedures="tooth.schemaProcedures"
                  :selectedSegments="extraction ? [] : selectedSegments"
                  :direction="direction"
                  @segment-click="handleSegmentClick"
                />
              </div>
            </template>
          </template>
          <template v-else>
            <!-- 🎯 Schematic moved to end with margin for bottom direction -->
            <template v-if="!hideTooth && !rootOnly">
              <div class="schematic-at-end schematic-at-end--bottom">
                <Schematic
                  :number="tooth.number"
                  :schemaProcedures="tooth.schemaProcedures"
                  :selectedSegments="extraction ? [] : selectedSegments"
                  :direction="direction"
                  @segment-click="handleSegmentClick"
                />
              </div>
            </template>

            <!-- Single wrapper for tooth components (Schematic moved out) -->
            <div class="tooth-components-wrapper" :class="{ 'extraction-blocked': !!extraction }">
              <GumOverlay :direction="direction" :hasCutout="hasExposedToothProcedure" />
              <template v-if="!hideTooth">
                <template v-if="rootOnly">
                  <!-- 🎯 Clipping container specifically for tooth -->
                  <div class="tooth-clip-container">
                    <div
                      class="tooth-only-wrapper"
                      :class="{ 'impacted-tooth--bottom': isImpactedTooth }"
                    >
                      <Tooth
                        :number="tooth.number"
                        :toothProcedures="tooth.toothProcedures"
                        :selectedSegments="extraction ? [] : selectedSegments"
                        :direction="direction"
                        only-root
                        @segment-click="handleSegmentClick"
                      />
                    </div>
                  </div>
                </template>
                <template v-else>
                  <!-- 🎯 Clipping container specifically for tooth -->
                  <div class="tooth-clip-container">
                    <div
                      class="tooth-only-wrapper"
                      :class="{ 'impacted-tooth--bottom': isImpactedTooth }"
                    >
                      <Tooth
                        :number="tooth.number"
                        :toothProcedures="tooth.toothProcedures"
                        :selectedSegments="extraction ? [] : selectedSegments"
                        :direction="direction"
                        @segment-click="handleSegmentClick"
                      />
                    </div>
                  </div>
                </template>
              </template>
              <!-- Single hover blocker for all components -->
              <div v-if="extraction" class="hover-blocker"></div>
            </div>

            <ToothLabel
              :toothNumber="tooth.number"
              :isExtra="isExtra"
              :isSelected="isSelected"
              @add-extra-before="
                $emit('add-extra-tooth', {
                  base: tooth.number,
                  direction: ExtraToothDirection.Before,
                })
              "
              @add-extra-after="
                $emit('add-extra-tooth', {
                  base: tooth.number,
                  direction: ExtraToothDirection.After,
                })
              "
              @remove-tooth="$emit('remove-tooth', tooth.number)"
              :direction="direction"
            />
          </template>
        </div>

        <!-- Extraction Overlay positioned to cover only tooth components area -->
        <ExtractionOverlay v-if="extraction" :direction="direction" />
        
        <!-- Observation Overlays for different parts -->
        <IconOverlay 
          v-if="toothLevelObservation" 
          :direction="direction" 
          position="tooth">
          <Eye class="w-5 h-5 text-blue-600 opacity-80" />
        </IconOverlay>
      </div>
    </PopoverTrigger>

    <PopoverContent v-if="assignedToothLevelProcedures.length > 0" class="w-auto">
      {{ assignedToothLevelProcedures.map((p) => p.procedure.name).join(', ') }}
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { ToothData } from '@/types/odontogram/odontogram'
import { ToothContainerDirection, ExtraToothDirection } from '@/types/odontogram/odontogram'
import ExtractionOverlay from './ExtractionOverlay.vue'
import GumOverlay from './GumOverlay.vue'
import IconOverlay from './IconOverlay.vue'
import Tooth from './Tooth.vue'
import Schematic from './Schematic.vue'
import ToothLabel from './ToothLabel.vue'
import { Eye } from 'lucide-vue-next'

interface Props {
  tooth: ToothData
  isSelected: boolean
  selectedSegments: string[]
  direction: ToothContainerDirection
}

interface Emits {
  (e: 'tooth-click'): void
  (e: 'segment-click', segmentId: string): void
  (e: 'add-extra-tooth', event: { base: string; direction: ExtraToothDirection }): void
  (e: 'remove-tooth', number: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const hoveredTooth = ref<string | null>(null)

const isExtra = computed(() => props.tooth.number.includes('+') || props.tooth.number.includes('-'))

const assignedToothLevelProcedures = computed(() =>
  props.tooth.toothProcedures.filter((a) => a.toothPart.toLowerCase() === 'tooth'),
)

const extraction = computed(() =>
  assignedToothLevelProcedures.value.find(
    (a) => a.procedure.name === 'Ekstrakcja' && a.procedure.visual.visualType === 'Icon',
  ),
)

const hasExposedToothProcedure = computed(() =>
  assignedToothLevelProcedures.value.some(
    (p) => p.procedure.name === 'Recesja' && p.procedure.visual.visualType === 'GumShape',
  ),
)

const hideTooth = computed(() =>
  assignedToothLevelProcedures.value.some((a) => a.procedure.behavior === 'HideTooth'),
)

const rootOnly = computed(() =>
  assignedToothLevelProcedures.value.some((a) => a.procedure.behavior === 'RootOnly'),
)

// 🎯 Check if tooth has impacted tooth procedure
const isImpactedTooth = computed(() =>
  assignedToothLevelProcedures.value.some((a) => a.procedure.behavior === 'ImpactedTooth'),
)

// 🎯 Check for observation procedures at different levels
const toothLevelObservation = computed(() =>
  assignedToothLevelProcedures.value.find(
    (a) => a.procedure.name === 'Obserwacja' && a.toothPart === 'Tooth',
  ),
)

const crownObservation = computed(() =>
  props.tooth.toothProcedures.find(
    (a) => a.procedure.name === 'Obserwacja' && a.toothPart === 'Crown',
  ),
)

const rootObservation = computed(() =>
  props.tooth.toothProcedures.find(
    (a) => a.procedure.name === 'Obserwacja' && a.toothPart === 'Root',
  ),
)

const schematicObservation = computed(() =>
  props.tooth.schemaProcedures.find(
    (a) => a.procedure.name === 'Obserwacja',
  ),
)

const showTooltip = computed(
  () => hoveredTooth.value === props.tooth.number && assignedToothLevelProcedures.value.length > 0,
)

const handleToothClick = () => {
  // Prevent tooth selection when extracted or hidden, but still allow the click event to bubble
  // This way ToothLabel interactions still work
  if (!extraction.value && !hideTooth.value) {
    emit('tooth-click')
  }
}

const handleSegmentClick = (segmentId: string) => {
  // Prevent segment clicks when extracted
  if (!extraction.value) {
    emit('segment-click', segmentId)
  }
}
</script>

<style scoped>
/* Fixed layout to match React/Mantine ToothContainer */
.tooth-wrapper {
  /* Main container behaves like Mantine's Stack - vertical flex */
  outline: 2px solid var(--border);
  outline-offset: -1px;
  width: 90px;
  height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  position: relative;
  cursor: pointer;
}

.tooth-wrapper:hover {
  background-color: var(--muted);
}

.selected {
  outline: 2px solid var(--destructive);
  outline-offset: -1px;
  z-index: 2;
  background-color: var(--destructive) / 0.2;
}

/* Extracted tooth styling - only affects wrapper interaction, not visuals */
.tooth-wrapper--extracted {
  cursor: not-allowed;
}

/* Prevent selection highlighting when extracted */
.tooth-wrapper--extracted.selected {
  outline: 2px solid var(--border);
  background-color: var(--muted) / 0.1;
}

/* Group container that mimics Mantine's Group with h={280} - adaptive layout */
.tooth-group {
  display: flex;
  flex-direction: column; /* Default for Top direction - Schematic at end */
  align-items: center;
  justify-content: start;
  height: 280px;
  width: 100%;
  gap: 4px;
  /* 🎯 REMOVED: No overflow clipping here to avoid cutting off tooth crowns */
}

.tooth-group--bottom {
  flex-direction: column; /* Bottom direction keeps same flex direction but template order changes */
  justify-content: end;
}

/* Single wrapper for all tooth components - KEEP display: contents for layout */
.tooth-components-wrapper {
  position: relative;
  display: contents; /* 🎯 RESTORED: Keep original layout behavior */
  /* 🎯 REMOVED: No overflow clipping here */
}

/* 🎯 Specific wrapper for Tooth component only */
.tooth-only-wrapper {
  position: relative;
  transition: transform 0.3s ease; /* Smooth transition for impacted tooth movement */
  /* 🎯 REMOVED: No overflow clipping here to preserve tooth crowns */
}

/* 🎯 Impacted tooth translations - clipped by parent containers */
.tooth-only-wrapper.impacted-tooth--top {
  transform: translateY(-40px);
}

.tooth-only-wrapper.impacted-tooth--bottom {
  transform: translateY(40px);
}

/* Only block interactions, no visual effects */
.tooth-components-wrapper.extraction-blocked > * {
  pointer-events: none !important;
  cursor: not-allowed !important;
}

/* Invisible overlay that completely blocks mouse events */
.hover-blocker {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 15;
  cursor: not-allowed;
  background: transparent;
  pointer-events: all;
}

.tooth-wrapper--hidden {
  pointer-events: none;
}
.tooth-wrapper--hidden .tooth-label {
  pointer-events: auto;
}

/* 🎯 NEW: Dedicated clipping container for tooth component */
.tooth-clip-container {
  position: relative;
  width: 100%;
  height: 140px; /* Increased from 120px to cover full tooth area */
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: -3px; /* Negative margin to eliminate the gap */
}

/* 🎯 NEW: Schematic positioned at end with margin */
.schematic-at-end {
  margin-top: 30px; /* Slight margin to separate from other components */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 🎯 NEW: Bottom direction schematic with margin */
.schematic-at-end--bottom {
  margin-top: 0;
  margin-bottom: 30px; /* Margin for bottom direction */
}
</style>
