<template>
  <Transition name="modal-fade">
    <div 
      v-if="show" 
      class="modal-backdrop" 
      @mousedown="handleBackdropMouseDown"
      @mouseup="handleBackdropMouseUp"
    >
      <div class="modal-content" @mousedown.stop @mouseup.stop>
        <header class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button type="button" class="btn-close" @click="close">×</button>
        </header>
        <section class="modal-body">
          <slot></slot>
        </section>
        <footer class="modal-footer">
          <slot name="footer"></slot>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: 'Modal Title',
  },
});

const emit = defineEmits(['close']);

// Rastrear donde comenzó el mousedown
const mouseDownOnBackdrop = ref(false);

const handleBackdropMouseDown = () => {
  mouseDownOnBackdrop.value = true;
};

const handleBackdropMouseUp = () => {
  // Solo cerrar si tanto mousedown como mouseup ocurrieron en el backdrop
  if (mouseDownOnBackdrop.value) {
    close();
  }
  mouseDownOnBackdrop.value = false;
};

const close = () => {
  emit('close');
};

// Bloquear/desbloquear el scroll del body cuando el modal se muestra/oculta
watch(() => props.show, (show) => {
  if (show) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
    mouseDownOnBackdrop.value = false; // Reset al cerrar
  }
}, { immediate: true });
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  width: 90%;
  max-width: 750px;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
}

.btn-close {
  border: none;
  background: transparent;
  font-size: 1.5rem;
  font-weight: 300;
  cursor: pointer;
  color: #718096;
  transition: color 0.2s ease;
}

.btn-close:hover {
  color: #1a202c;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* Animación de entrada/salida */
.modal-fade-enter-active, 
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from, 
.modal-fade-leave-to {
  opacity: 0;
}
</style>