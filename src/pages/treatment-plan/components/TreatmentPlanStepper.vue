<script setup lang="ts">
import { Check, Circle, Dot } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import type { Step } from '../types'

interface Props {
  steps: Step[]
  currentStep: number
  onStepChange?: (step: number) => void
}

const props = defineProps<Props>()

function handleStepClick(step: number) {
  if (step <= props.currentStep && props.onStepChange) {
    props.onStepChange(step)
  }
}
</script>

<template>
  <div class="flex w-full flex-start gap-2 mb-6">
    <div
      v-for="step in steps"
      :key="step.step"
      class="relative flex w-full flex-col items-center justify-center"
    >
      <div
        v-if="step.step !== steps[steps.length - 1].step"
        class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted"
        :class="{ 'bg-primary': step.step < currentStep }"
      />

      <Button
        :variant="step.step <= currentStep ? 'default' : 'outline'"
        size="icon"
        class="z-10 rounded-full shrink-0"
        :class="[
          step.step === currentStep && 'ring-2 ring-ring ring-offset-2 ring-offset-background',
        ]"
        :disabled="step.step > currentStep"
        @click="handleStepClick(step.step)"
      >
        <Check v-if="step.step < currentStep" class="size-5" />
        <Circle v-else-if="step.step === currentStep" />
        <Dot v-else />
      </Button>

      <div class="mt-5 flex flex-col items-center text-center">
        <div
          :class="[step.step === currentStep && 'text-primary']"
          class="text-sm font-semibold transition lg:text-base"
        >
          {{ step.title }}
        </div>
        <div
          :class="[step.step === currentStep && 'text-primary']"
          class="sr-only text-xs text-muted-foreground transition md:not-sr-only lg:text-sm"
        >
          {{ step.description }}
        </div>
      </div>
    </div>
  </div>
</template>