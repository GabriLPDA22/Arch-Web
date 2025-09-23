<template>
  <Teleport to="body">
    <!-- Background Overlay -->
    <Transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100"
      leave-active-class="ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto" @click="handleBackdropClick">
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <!-- Background -->
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

          <!-- Modal Panel -->
          <Transition enter-active-class="ease-out duration-300"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <div v-if="modelValue" :class="modalClasses" @click.stop>
              <!-- Header -->
              <div v-if="title || $slots.header" class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <!-- Icon -->
                  <div v-if="icon" :class="iconContainerClasses">
                    <component :is="iconComponent" :class="iconClasses" />
                  </div>

                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                    <!-- Custom Header Slot -->
                    <slot name="header">
                      <h3 class="text-lg font-medium leading-6 text-gray-900">
                        {{ title }}
                      </h3>
                      <p v-if="description" class="mt-2 text-sm text-gray-500">
                        {{ description }}
                      </p>
                    </slot>
                  </div>

                  <!-- Close Button -->
                  <div v-if="closable" class="ml-3 h-7 flex items-center">
                    <button @click="closeModal"
                      class="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-oxford">
                      <span class="sr-only">Cerrar</span>
                      <XMarkIcon class="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Content -->
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6">
                <slot></slot>
              </div>

              <!-- Footer -->
              <div v-if="$slots.footer || showDefaultFooter"
                class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <slot name="footer">
                  <template v-if="showDefaultFooter">
                    <button v-if="confirmText" @click="handleConfirm" :disabled="confirmDisabled"
                      :class="confirmButtonClasses">
                      {{ confirmText }}
                    </button>

                    <button v-if="cancelText" @click="closeModal"
                      class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-oxford sm:mt-0 sm:mr-3 sm:w-auto sm:text-sm">
                      {{ cancelText }}
                    </button>
                  </template>
                </slot>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full'].includes(value)
  },
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'success', 'warning', 'error', 'info'].includes(value)
  },
  icon: {
    type: String,
    default: ''
  },
  closable: {
    type: Boolean,
    default: true
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  confirmText: {
    type: String,
    default: ''
  },
  cancelText: {
    type: String,
    default: ''
  },
  confirmDisabled: {
    type: Boolean,
    default: false
  },
  confirmDanger: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel', 'close'])

// Computed
const modalClasses = computed(() => {
  const baseClasses = 'relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all'

  const sizeClasses = {
    xs: 'sm:my-8 sm:w-full sm:max-w-xs',
    sm: 'sm:my-8 sm:w-full sm:max-w-sm',
    md: 'sm:my-8 sm:w-full sm:max-w-md',
    lg: 'sm:my-8 sm:w-full sm:max-w-lg',
    xl: 'sm:my-8 sm:w-full sm:max-w-xl',
    '2xl': 'sm:my-8 sm:w-full sm:max-w-2xl',
    full: 'sm:my-8 sm:w-full sm:max-w-7xl'
  }

  return `${baseClasses} ${sizeClasses[props.size]}`
})

const iconComponent = computed(() => {
  if (props.icon) {
    const iconMap = {
      warning: ExclamationTriangleIcon,
      success: CheckCircleIcon,
      error: ExclamationCircleIcon,
      info: InformationCircleIcon
    }
    return iconMap[props.icon] || InformationCircleIcon
  }

  const typeIconMap = {
    success: CheckCircleIcon,
    warning: ExclamationTriangleIcon,
    error: ExclamationCircleIcon,
    info: InformationCircleIcon
  }

  return typeIconMap[props.type] || InformationCircleIcon
})

const iconContainerClasses = computed(() => {
  if (!props.icon && props.type === 'default') return ''

  const typeClasses = {
    success: 'bg-green-100',
    warning: 'bg-yellow-100',
    error: 'bg-red-100',
    info: 'bg-blue-100',
    default: 'bg-gray-100'
  }

  return `mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${typeClasses[props.type]}`
})

const iconClasses = computed(() => {
  const typeClasses = {
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    info: 'text-blue-600',
    default: 'text-gray-600'
  }

  return `h-6 w-6 ${typeClasses[props.type]}`
})

const showDefaultFooter = computed(() => {
  return props.confirmText || props.cancelText
})

const confirmButtonClasses = computed(() => {
  const baseClasses = 'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm'

  if (props.confirmDanger) {
    return `${baseClasses} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed`
  } else {
    return `${baseClasses} bg-oxford text-white hover:bg-oxford-light focus:ring-oxford disabled:opacity-50 disabled:cursor-not-allowed`
  }
})

// Methods
const closeModal = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop && props.closable) {
    closeModal()
  }
}

// Keyboard events
const handleKeydown = (event) => {
  if (event.key === 'Escape' && props.closable && props.modelValue) {
    closeModal()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>
