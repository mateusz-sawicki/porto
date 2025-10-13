<template>
  <Icon
    v-if="iconKey"
    :icon="iconKey"
    :class="props.class"
  />
  <div
    v-else
    class="flex items-center justify-center"
    :class="props.class"
  >
    <span class="text-xs text-red-500" :title="`Icon not found: ${props.iconSource}/${props.iconName}`">
      {{ displayName }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  iconName: string
  iconSource: string
  class?: string
}

const props = defineProps<Props>()

const displayName = computed(() => {
  let iconName = props.iconName

  // Handle prefixed icon names from API (e.g., "mdi:tilde")
  if (props.iconName.includes(':')) {
    const [, name] = props.iconName.split(':', 2)
    iconName = name
  }

  return iconName
})

const iconKey = computed(() => {
  let source = props.iconSource.toLowerCase()
  let iconName = props.iconName

  // Handle prefixed icon names from API (e.g., "mdi:tilde", "lucide:triangle-right")
  if (props.iconName.includes(':')) {
    const [prefix, name] = props.iconName.split(':', 2)
    source = prefix.toLowerCase()
    iconName = name
    console.log(`🎯 API icon with prefix: ${props.iconName} -> source: ${source}, name: ${iconName}`)
  }

  // Convert iconName to kebab-case for iconify
  const kebabIconName = iconName
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()

  // Map sources to iconify collection names
  let collection = ''
  switch (source) {
    case 'tabler':
      collection = 'tabler'
      break
    case 'lucide':
      collection = 'lucide'
      break
    case 'heroicons':
      collection = 'heroicons'
      break
    case 'phosphor':
    case 'ph':
      collection = 'ph'
      break
    case 'feather':
      collection = 'feather'
      break
    case 'material':
      collection = 'material-symbols'
      break
    case 'mdi':
      collection = 'mdi'
      break
    default:
      console.warn(`❌ Unsupported icon source: ${source}`)
      return null
  }

  const fullIconKey = `${collection}:${kebabIconName}`
  console.log(`🚀 Loading icon: ${fullIconKey}`)
  return fullIconKey
})
</script>