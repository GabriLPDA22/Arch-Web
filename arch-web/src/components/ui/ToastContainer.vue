<!-- src/components/ToastContainer.vue -->
<template>
  <!-- Renderiza todos los toasts -->
  <ToastNotification
    v-for="toast in toasts"
    :key="toast.id"
    :show="toast.show"
    :type="toast.type"
    :title="toast.title"
    :message="toast.message"
    :duration="toast.duration"
    @close="handleClose(toast.id)"
  />
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'
import ToastNotification from './ToastNotification.vue'

const { toasts, removeToast } = useToast()

const handleClose = (id: number) => {
  removeToast(id)
}
</script>

<style scoped>
/* No necesita estilos, cada ToastNotification tiene los suyos */
</style>