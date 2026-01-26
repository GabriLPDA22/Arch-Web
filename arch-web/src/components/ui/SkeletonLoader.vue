<!-- 
  SkeletonLoader.vue
  Skeleton loader animado para estados de carga con efecto shimmer
  
  Uso básico:
    <SkeletonLoader width="200px" height="20px" />
    <SkeletonLoader width="100%" height="150px" variant="rounded" />
    <SkeletonLoader variant="circle" :size="48" />
    <SkeletonLoader variant="text" :lines="3" />
-->

<template>
  <div v-if="variant === 'text'" class="skeleton-text-group">
    <div
      v-for="i in lines"
      :key="i"
      class="skeleton skeleton-text"
      :class="[themeClass, { animated }]"
      :style="{
        width: i === lines ? '60%' : '100%',
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: `${borderRadius}px`,
      }"
    >
      <div v-if="animated" class="shimmer"></div>
    </div>
  </div>

  <div
    v-else
    class="skeleton"
    :class="[variantClass, themeClass, { animated }]"
    :style="skeletonStyle"
  >
    <div v-if="animated" class="shimmer"></div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  // Dimensiones
  width?: string | number
  height?: string | number
  size?: number // Para variante circle
  
  // Variantes
  variant?: 'default' | 'rounded' | 'circle' | 'text' | 'card' | 'image'
  
  // Tema
  theme?: 'light' | 'dark'
  
  // Opciones
  animated?: boolean
  borderRadius?: number
  lines?: number // Para variante text
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '20px',
  variant: 'default',
  theme: 'light',
  animated: true,
  borderRadius: 8,
  lines: 1,
})

const variantClass = computed(() => `skeleton-${props.variant}`)
const themeClass = computed(() => `skeleton-theme-${props.theme}`)

const skeletonStyle = computed(() => {
  const styles: Record<string, string> = {}
  
  if (props.variant === 'circle') {
    const circleSize = props.size || 48
    styles.width = `${circleSize}px`
    styles.height = `${circleSize}px`
    styles.borderRadius = '50%'
  } else if (props.variant === 'card') {
    styles.width = typeof props.width === 'number' ? `${props.width}px` : props.width
    styles.height = typeof props.height === 'number' ? `${props.height}px` : props.height
    styles.borderRadius = '16px'
  } else if (props.variant === 'image') {
    styles.width = typeof props.width === 'number' ? `${props.width}px` : props.width
    styles.height = typeof props.height === 'number' ? `${props.height}px` : props.height
    styles.borderRadius = '12px'
  } else if (props.variant === 'rounded') {
    styles.width = typeof props.width === 'number' ? `${props.width}px` : props.width
    styles.height = typeof props.height === 'number' ? `${props.height}px` : props.height
    styles.borderRadius = '9999px'
  } else {
    styles.width = typeof props.width === 'number' ? `${props.width}px` : props.width
    styles.height = typeof props.height === 'number' ? `${props.height}px` : props.height
    styles.borderRadius = `${props.borderRadius}px`
  }
  
  return styles
})
</script>

<style scoped>
.skeleton {
  position: relative;
  overflow: hidden;
  background-color: #e5e7eb;
}

/* Temas */
.skeleton-theme-light {
  background-color: #e5e7eb;
}

.skeleton-theme-dark {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Efecto shimmer */
.shimmer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 100%
  );
  animation: shimmer 1.5s infinite;
  transform: translateX(-100%);
}

.skeleton-theme-dark .shimmer {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.15) 50%,
    transparent 100%
  );
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Variante texto - grupo de líneas */
.skeleton-text-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-text {
  height: 14px;
  border-radius: 7px;
}

/* Sin animación */
.skeleton:not(.animated) {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
