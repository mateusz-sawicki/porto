<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useDark, useToggle } from '@vueuse/core'
import { Button } from '@/components/ui/button'
import { LogOut, User, Bell, Sun, MoonStar, Menu } from 'lucide-vue-next'

// Pass { disableTransition: false } to enable transitions
const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <Button variant="outline" class="border-0 p-[6px] ml-2 w-8 h-8" @click="toggleDark()">
    <Sun v-if="isDark" />
    <MoonStar v-else />
  </Button>
</template>
