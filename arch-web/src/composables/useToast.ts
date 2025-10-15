// src/composables/useToast.ts
import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastOptions {
  type?: ToastType
  title: string
  message: string
  duration?: number
  autoClose?: number // Support for both properties
}

interface Toast extends ToastOptions {
  id: number
  show: boolean
  duration: number // Make it required to avoid undefined
}

const toasts = ref<Toast[]>([])
let nextId = 0

export function useToast() {
  const showToast = (
    options: ToastOptions | string,
    message?: string,
    config?: { duration?: number; autoClose?: number },
  ) => {
    // Support for both calling forms
    let toastOptions: ToastOptions

    if (typeof options === 'string') {
      // Old form: success('title', 'message', { autoClose: 3500 })
      toastOptions = {
        title: options,
        message: message || '',
        duration: config?.duration || config?.autoClose || 5000,
      }
    } else {
      // New form: showToast({ type, title, message, autoClose })
      toastOptions = {
        ...options,
        duration: options.duration || options.autoClose || 5000,
      }
    }

    const id = nextId++
    const toast: Toast = {
      id,
      show: true,
      type: toastOptions.type || 'info',
      title: toastOptions.title,
      message: toastOptions.message,
      duration: toastOptions.duration || 5000, // Always has a value
    }

    toasts.value.push(toast)

    // Auto-close if duration is set
    if (toast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration)
    }
  }

  const success = (
    title: string,
    message: string,
    config?: { autoClose?: number; duration?: number },
  ) => {
    const duration = config?.autoClose || config?.duration || 5000
    showToast({ type: 'success', title, message, duration })
  }

  const error = (
    title: string,
    message: string,
    config?: { autoClose?: number; duration?: number },
  ) => {
    const duration = config?.autoClose || config?.duration || 6000
    showToast({ type: 'error', title, message, duration })
  }

  const warning = (
    title: string,
    message: string,
    config?: { autoClose?: number; duration?: number },
  ) => {
    const duration = config?.autoClose || config?.duration || 5000
    showToast({ type: 'warning', title, message, duration })
  }

  const info = (
    title: string,
    message: string,
    config?: { autoClose?: number; duration?: number },
  ) => {
    const duration = config?.autoClose || config?.duration || 5000
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
