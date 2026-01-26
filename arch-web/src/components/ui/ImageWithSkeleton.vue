<!-- 
  ImageWithSkeleton.vue
  Componente de imagen con skeleton loading automático
-->

<template>
  <div class="image-with-skeleton" :style="containerStyle">
    <!-- Skeleton -->
    <div v-if="!loaded && !error" class="skeleton-placeholder" :style="skeletonStyle">
      <div class="shimmer"></div>
    </div>
    
    <!-- Imagen -->
    <img
      v-show="loaded"
      :src="src"
      :alt="alt"
      :class="imageClass"
      :style="imageStyle"
      @load="onLoad"
      @error="onError"
    />
    
    <!-- Error state -->
    <div v-if="error && showErrorState" class="error-state" :style="skeletonStyle">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21,5V11.59L18,8.58L14,12.59L10,8.59L6,12.59L3,9.58V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5M18,11.42L21,14.43V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V12.42L6,15.41L10,11.41L14,15.41" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  src: string
  alt?: string
  width?: string | number
  height?: string | number
  borderRadius?: string | number
  objectFit?: 'cover' | 'contain' | 'fill' | 'none'
  imageClass?: string
  showErrorState?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  width: '100%',
  height: 'auto',
  borderRadius: 8,
  objectFit: 'cover',
  imageClass: '',
  showErrorState: true,
})

const emit = defineEmits<{
  (e: 'load'): void
  (e: 'error'): void
}>()

const loaded = ref(false)
const error = ref(false)

const containerStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}))

const skeletonStyle = computed(() => ({
  borderRadius: typeof props.borderRadius === 'number' ? `${props.borderRadius}px` : props.borderRadius,
}))

const imageStyle = computed(() => ({
  borderRadius: typeof props.borderRadius === 'number' ? `${props.borderRadius}px` : props.borderRadius,
  objectFit: props.objectFit,
}))

const onLoad = () => {
  loaded.value = true
  emit('load')
}

const onError = () => {
  error.value = true
  loaded.value = true
  emit('error')
}
</script>

<style scoped>
.image-with-skeleton {
  position: relative;
  display: inline-block;
  overflow: hidden;
}

.skeleton-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #e5e7eb;
  overflow: hidden;
}

/* Shimmer effect */
.shimmer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.5) 50%,
    transparent 100%
  );
  animation: shimmer 1.5s infinite;
  transform: translateX(-100%);
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

img {
  width: 100%;
  height: 100%;
  display: block;
}

.error-state {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}
</style>
