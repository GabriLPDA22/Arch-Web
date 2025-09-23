<template>
  <div class="card card-hover">
    <div class="card-body">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div :class="iconContainerClasses">
            <component :is="iconComponent" :class="iconClasses" />
          </div>
        </div>

        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 truncate">
              {{ title }}
            </dt>
            <dd class="flex items-baseline">
              <div class="text-2xl font-semibold text-gray-900">
                {{ formattedValue }}
              </div>

              <div v-if="change" class="ml-2 flex items-baseline text-sm font-semibold">
                <div :class="changeClasses">
                  <component :is="changeIcon" class="self-center flex-shrink-0 h-3 w-3" />
                  <span class="sr-only">
                    {{ isPositiveChange ? 'Increased' : 'Decreased' }} by
                  </span>
                  {{ Math.abs(parseFloat(change.toString().replace('%', ''))) }}%
                </div>

                <div class="ml-1 text-gray-500">
                  {{ period || 'desde el mes anterior' }}
                </div>
              </div>
            </dd>
          </dl>
        </div>
      </div>

      <!-- Progress Bar (opcional) -->
      <div v-if="progress !== undefined" class="mt-4">
        <div class="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Progreso</span>
          <span>{{ Math.round(progress) }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div :class="progressBarClasses" class="h-2 rounded-full transition-all duration-500 ease-out"
            :style="{ width: `${Math.min(100, Math.max(0, progress))}%` }"></div>
        </div>
      </div>

      <!-- Action Button (opcional) -->
      <div v-if="actionText && actionTo" class="mt-4">
        <router-link :to="actionTo" class="text-sm font-medium text-oxford hover:text-oxford-light">
          {{ actionText }}
          <span aria-hidden="true"> &rarr;</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  UsersIcon,
  CalendarIcon,
  GiftIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  change: {
    type: [Number, String],
    default: null
  },
  period: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'ChartBarIcon'
  },
  color: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'green', 'red', 'yellow', 'purple', 'indigo', 'pink', 'oxford'].includes(value)
  },
  progress: {
    type: Number,
    default: undefined
  },
  actionText: {
    type: String,
    default: ''
  },
  actionTo: {
    type: String,
    default: ''
  },
  format: {
    type: String,
    default: 'number',
    validator: (value) => ['number', 'currency', 'percentage'].includes(value)
  }
})

// Icon mapping
const iconMap = {
  UsersIcon,
  CalendarIcon,
  GiftIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
}

const iconComponent = computed(() => iconMap[props.icon] || ChartBarIcon)

const iconContainerClasses = computed(() => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500',
    pink: 'bg-pink-500',
    oxford: 'bg-oxford'
  }

  return [
    'flex items-center justify-center h-10 w-10 rounded-md',
    colorClasses[props.color]
  ]
})

const iconClasses = computed(() => 'h-6 w-6 text-white')

const formattedValue = computed(() => {
  const numValue = typeof props.value === 'string' ? parseFloat(props.value) : props.value

  if (isNaN(numValue)) return props.value

  switch (props.format) {
    case 'currency':
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
      }).format(numValue)

    case 'percentage':
      return `${numValue.toFixed(1)}%`

    case 'number':
    default:
      return new Intl.NumberFormat('es-ES').format(numValue)
  }
})

const isPositiveChange = computed(() => {
  if (!props.change) return true
  const changeValue = typeof props.change === 'string'
    ? parseFloat(props.change.replace('%', ''))
    : props.change
  return changeValue >= 0
})

const changeIcon = computed(() => isPositiveChange.value ? ArrowUpIcon : ArrowDownIcon)

const changeClasses = computed(() => {
  const baseClasses = 'inline-flex items-baseline px-2 py-0.5 rounded-full text-sm font-medium'

  if (isPositiveChange.value) {
    return `${baseClasses} bg-green-100 text-green-800`
  } else {
    return `${baseClasses} bg-red-100 text-red-800`
  }
})

const progressBarClasses = computed(() => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500',
    pink: 'bg-pink-500',
    oxford: 'bg-oxford'
  }

  return colorClasses[props.color]
})
</script>
