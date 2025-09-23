<template>
  <div :class="containerClasses">
    <div :class="spinnerClasses"></div>
    <p v-if="text" :class="textClasses">{{ text }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  text: {
    type: String,
    default: ''
  },
  centered: {
    type: Boolean,
    default: false
  },
  fullscreen: {
    type: Boolean,
    default: false
  }
})

const containerClasses = computed(() => {
  const classes = ['flex flex-col items-center justify-center']

  if (props.fullscreen) {
    classes.push('fixed inset-0 bg-white bg-opacity-90 z-50')
  } else if (props.centered) {
    classes.push('min-h-64')
  }

  return classes
})

const spinnerClasses = computed(() => {
  const baseClasses = ['border-2 border-gray-300 border-t-oxford rounded-full animate-spin']

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  baseClasses.push(sizeClasses[props.size])

  return baseClasses
})

const textClasses = computed(() => {
  const classes = ['text-gray-600 font-medium mt-3']

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  }

  classes.push(textSizeClasses[props.size])

  return classes
})
</script>
