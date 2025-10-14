// src/composables/useToast.ts
import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastOptions {
  type?: ToastType
  title: string
  message: string
  duration?: number
}

interface Toast extends ToastOptions {
  id: number
  show: boolean
}

const toasts = ref<Toast[]>([])
let nextId = 0

export function useToast() {
  const showToast = (options: ToastOptions) => {
    const id = nextId++
    const toast: Toast = {
      id,
      show: true,
      type: options.type || 'info',
      title: options.title,
      message: options.message,
      duration: options.duration !== undefined ? options.duration : 3500,
    }

    toasts.value.push(toast)
  }

  const success = (title: string, message: string, duration?: number) => {
    showToast({ type: 'success', title, message, duration })
  }

  const error = (title: string, message: string, duration?: number) => {
    showToast({ type: 'error', title, message, duration })
  }

  const warning = (title: string, message: string, duration?: number) => {
    showToast({ type: 'warning', title, message, duration })
  }

  const info = (title: string, message: string, duration?: number) => {
    showToast({ type: 'info', title, message, duration })
  }

  const removeToast = (id: number) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  return {
    toasts,
    showToast,
    success,
    error,
    warning,
    info,
    removeToast,
  }
}