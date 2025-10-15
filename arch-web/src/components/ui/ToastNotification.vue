<!-- src/components/ToastNotification.vue -->
<template>
  <!-- Overlay that blocks scrolling -->
  <Teleport to="body">
    <Transition name="overlay">
      <div v-if="isVisible" class="toast-overlay" @click="handleOverlayClick">
        <Transition name="toast" appear>
          <div v-if="isVisible" :class="['toast-container', `toast-${type}`]" @click.stop>
            <!-- Animated icon -->
            <div class="toast-icon-wrapper">
              <div class="toast-icon-bg"></div>
              <div class="toast-icon">
                <!-- Success Icon -->
                <svg
                  v-if="type === 'success'"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

                <!-- Error Icon -->
                <svg
                  v-else-if="type === 'error'"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

                <!-- Warning Icon -->
                <svg
                  v-else-if="type === 'warning'"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path
                    d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

                <!-- Info Icon -->
                <svg
                  v-else
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>

            <!-- Content -->
            <div class="toast-content">
              <h3 class="toast-title">{{ title }}</h3>
              <p class="toast-message">{{ message }}</p>
            </div>

            <!-- Close button -->
            <button class="toast-close" @click="close" aria-label="Close notification">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch } from 'vue'

interface Props {
  type?: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  show: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 3500,
})

const emit = defineEmits<{
  close: []
}>()

const isVisible = ref(false)
let timeoutId: ReturnType<typeof setTimeout> | null = null

const close = () => {
  isVisible.value = false
  // Small delay before emitting to let animation finish
  setTimeout(() => {
    emit('close')
  }, 300)
}

const handleOverlayClick = () => {
  close()
}

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      isVisible.value = true
      // Block body scroll
      document.body.style.overflow = 'hidden'

      // Auto-close if duration is set
      if (props.duration > 0) {
        if (timeoutId) clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          close()
        }, props.duration)
      }
    } else {
      isVisible.value = false
      // Restore body scroll
      document.body.style.overflow = ''
    }
  },
  { immediate: true },
)

// Clean up on unmount
onUnmounted(() => {
  document.body.style.overflow = ''
  if (timeoutId) clearTimeout(timeoutId)
})
</script>

<style scoped>
/* Overlay that blocks everything */
.toast-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

/* Toast container */
.toast-container {
  position: relative;
  background: #ffffff;
  border-radius: 20px;
  padding: 2rem;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
}

/* Icon wrapper with animation */
.toast-icon-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-icon-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.toast-icon {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  animation: iconPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Styles by alert type */
.toast-success .toast-icon-bg {
  background: rgba(34, 197, 94, 0.1);
}

.toast-success .toast-icon {
  background: #22c55e;
  color: #ffffff;
}

.toast-error .toast-icon-bg {
  background: rgba(239, 68, 68, 0.1);
}

.toast-error .toast-icon {
  background: #ef4444;
  color: #ffffff;
}

.toast-warning .toast-icon-bg {
  background: rgba(245, 158, 11, 0.1);
}

.toast-warning .toast-icon {
  background: #f59e0b;
  color: #ffffff;
}

.toast-info .toast-icon-bg {
  background: rgba(59, 130, 246, 0.1);
}

.toast-info .toast-icon {
  background: #3b82f6;
  color: #ffffff;
}

/* Text content */
.toast-content {
  flex: 1;
}

.toast-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.toast-message {
  font-size: 0.938rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
}

/* Close button */
.toast-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #f3f4f6;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
}

.toast-close:hover {
  background: #e5e7eb;
  color: #374151;
  transform: scale(1.1);
}

.toast-close:active {
  transform: scale(0.95);
}

/* Animations */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

@keyframes iconPop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Overlay transitions */
.overlay-enter-active,
.overlay-leave-active {
  transition: all 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}

/* Toast transitions */
.toast-enter-active {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(-20px);
}

.toast-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

/* Responsive */
@media (max-width: 640px) {
  .toast-container {
    max-width: 90%;
    padding: 1.5rem;
  }

  .toast-icon-wrapper {
    width: 64px;
    height: 64px;
  }

  .toast-icon {
    width: 52px;
    height: 52px;
  }

  .toast-icon svg {
    width: 24px;
    height: 24px;
  }

  .toast-title {
    font-size: 1.125rem;
  }

  .toast-message {
    font-size: 0.875rem;
  }
}
</style>
