<!-- arch-web/src/components/AlertMessage.vue -->
<template>
  <Transition name="alert">
    <div v-if="modelValue" :class="['alert', `alert-${type}`]" role="alert">
      <div class="alert-icon">
        <!-- Icono de Error -->
        <svg v-if="type === 'error'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
          />
        </svg>

        <!-- Icono de Éxito -->
        <svg
          v-else-if="type === 'success'"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
          />
        </svg>

        <!-- Icono de Advertencia -->
        <svg
          v-else-if="type === 'warning'"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
        </svg>

        <!-- Icono de Info -->
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
          />
        </svg>
      </div>

      <div class="alert-content">
        <p class="alert-message">{{ message }}</p>
      </div>

      <button v-if="dismissible" @click="close" class="alert-close" aria-label="Cerrar alerta">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
          />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  type?: 'error' | 'success' | 'warning' | 'info'
  message: string
  dismissible?: boolean
  autoClose?: number // milisegundos
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  dismissible: true,
  autoClose: 0,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// Auto-cerrar después de X milisegundos
if (props.autoClose > 0 && props.modelValue) {
  setTimeout(() => {
    close()
  }, props.autoClose)
}

const close = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.alert {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  border: 1px solid;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Tipos de alerta */
.alert-error {
  background: #fef2f2;
  border-color: #fecaca;
  color: #991b1b;
}

.alert-success {
  background: #f0fdf4;
  border-color: #bbf7d0;
  color: #166534;
}

.alert-warning {
  background: #fffbeb;
  border-color: #fde68a;
  color: #92400e;
}

.alert-info {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #1e40af;
}

.alert-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.alert-content {
  flex: 1;
}

.alert-message {
  margin: 0;
  font-size: 0.938rem;
  line-height: 1.5;
  font-weight: 500;
}

.alert-close {
  flex-shrink: 0;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s ease;
  color: inherit;
}

.alert-close:hover {
  opacity: 1;
}

/* Transición de entrada/salida */
.alert-enter-active,
.alert-leave-active {
  transition: all 0.3s ease;
}

.alert-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}

.alert-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
