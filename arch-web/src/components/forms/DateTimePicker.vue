<template>
  <div class="datetime-picker-wrapper">
    <VueDatePicker
      v-model="internalValue"
      :enable-time-picker="true"
      :format="formatDisplay"
      :preview-format="formatDisplay"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :min-date="minDate"
      :max-date="maxDate"
      locale="en-GB"
      :teleport="true"
      auto-apply
      :dark="false"
      :clearable="false"
    >
      <template #dp-input="{ value }">
        <div class="custom-input" :class="{ 'has-value': value, disabled }">
          <div class="input-content">
            <svg class="calendar-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15.6947 13.7H15.7037M15.6947 16.7H15.7037M11.9955 13.7H12.0045M11.9955 16.7H12.0045M8.29431 13.7H8.30329M8.29431 16.7H8.30329" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span v-if="value" class="input-text">{{ value }}</span>
            <span v-else class="input-placeholder">{{ placeholder }}</span>
          </div>
          <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 9L12 16L5 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </template>
    </VueDatePicker>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

interface Props {
  modelValue: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select date and time',
  required: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Convertir string ISO a Date para el picker
const internalValue = computed({
  get() {
    if (!props.modelValue) return null
    return new Date(props.modelValue)
  },
  set(newValue: Date | null) {
    if (!newValue) {
      emit('update:modelValue', '')
      return
    }
    
    // Verificar que la fecha es válida
    if (isNaN(newValue.getTime())) {
      console.error('DateTimePicker: Invalid date value')
      return
    }
    
    // Convertir a formato datetime-local (YYYY-MM-DDTHH:mm)
    const offset = newValue.getTimezoneOffset() * 60000
    const localDate = new Date(newValue.getTime() - offset)
    const isoString = localDate.toISOString().slice(0, 16)
    
    emit('update:modelValue', isoString)
  }
})

// Formato de visualización elegante
const formatDisplay = (date: Date) => {
  if (!date) return ''
  
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }
  
  return new Intl.DateTimeFormat('en-GB', options).format(date)
}
</script>

<style scoped>
.datetime-picker-wrapper {
  width: 100%;
}

.custom-input {
  position: relative;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 56px;
}

.custom-input:hover {
  border-color: #dbb067;
  background: #fafafa;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(219, 176, 103, 0.1);
}

.custom-input.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f5f5f5;
}

.custom-input.disabled:hover {
  transform: none;
  box-shadow: none;
}

.input-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.calendar-icon {
  width: 20px;
  height: 20px;
  color: #dbb067;
  flex-shrink: 0;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.custom-input:hover .calendar-icon {
  transform: scale(1.1);
}

.input-text {
  font-size: 1rem;
  font-weight: 500;
  color: #1a202c;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.input-placeholder {
  font-size: 1rem;
  color: #a0aec0;
}

.chevron-icon {
  width: 20px;
  height: 20px;
  color: #718096;
  flex-shrink: 0;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Estilos globales para el datepicker */
:deep(.dp__main) {
  font-family: inherit;
}

:deep(.dp__input) {
  display: none;
}

:deep(.dp__menu) {
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  padding: 1.25rem;
  background: #ffffff;
  backdrop-filter: blur(10px);
  animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 320px;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

:deep(.dp__calendar_header) {
  margin-bottom: 0.75rem;
  padding: 0.5rem;
}

:deep(.dp__calendar_header_item) {
  color: #718096;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

:deep(.dp__calendar_item) {
  padding: 0.5rem;
}

:deep(.dp__cell_inner) {
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

:deep(.dp__cell_inner:hover) {
  background: rgba(219, 176, 103, 0.15);
  color: #dbb067;
  transform: scale(1.05);
}

:deep(.dp__active_date) {
  background: linear-gradient(135deg, #dbb067 0%, #c9a05a 100%);
  color: white !important;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(219, 176, 103, 0.3);
}

:deep(.dp__today) {
  border: 2px solid #dbb067;
  font-weight: 600;
}

:deep(.dp__range_start),
:deep(.dp__range_end) {
  background: linear-gradient(135deg, #dbb067 0%, #c9a05a 100%);
  color: white;
}

:deep(.dp__range_between) {
  background: rgba(219, 176, 103, 0.2);
}

:deep(.dp__time_input) {
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  padding: 0.75rem;
  font-weight: 500;
  font-size: 1.25rem;
  text-align: center;
  min-width: 60px;
}

:deep(.dp__time_input:focus) {
  border-color: #dbb067;
  box-shadow: 0 0 0 3px rgba(219, 176, 103, 0.2);
  outline: none;
}

:deep(.dp__button) {
  color: #dbb067;
  transition: all 0.2s ease;
  border-radius: 0.375rem;
  padding: 0.5rem;
}

:deep(.dp__button:hover) {
  background: rgba(219, 176, 103, 0.15);
  transform: scale(1.05);
}

:deep(.dp__action_button) {
  background: linear-gradient(135deg, #dbb067 0%, #c9a05a 100%);
  color: white;
  border-radius: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
}

:deep(.dp__action_button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(219, 176, 103, 0.3);
}

:deep(.dp__action_row) {
  padding: 0.75rem 0 0 0;
}

:deep(.dp__selection_preview) {
  color: #1a202c;
  font-weight: 500;
  padding: 0.5rem;
}

:deep(.dp__month_year_select) {
  color: #1a202c;
  font-weight: 700;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

:deep(.dp__month_year_select:hover) {
  background: rgba(219, 176, 103, 0.1);
}

:deep(.dp__arrow_top),
:deep(.dp__arrow_bottom) {
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

:deep(.dp__arrow_top:hover),
:deep(.dp__arrow_bottom:hover) {
  background: rgba(219, 176, 103, 0.1);
}

:deep(.dp__time_col) {
  padding: 0.5rem;
}

:deep(.dp__time_display) {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.75rem;
  margin-bottom: 0.75rem;
}

:deep(.dp__time_col_reg) {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

:deep(.dp__inc_dec_button) {
  width: 100%;
  padding: 0.375rem;
  border-radius: 0.375rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #718096;
  transition: all 0.2s ease;
  cursor: pointer;
}

:deep(.dp__inc_dec_button:hover) {
  background: rgba(219, 176, 103, 0.1);
  border-color: #dbb067;
  color: #dbb067;
  transform: scale(1.05);
}

:deep(.dp__inc_dec_button_disabled) {
  opacity: 0.3;
  cursor: not-allowed;
}

:deep(.dp__overlay) {
  background: #ffffff;
  border-radius: 0.75rem;
  padding: 1rem;
}

:deep(.dp__overlay_col) {
  padding: 0.5rem;
}

:deep(.dp__overlay_cell) {
  border-radius: 0.5rem;
  padding: 0.75rem;
  transition: all 0.2s ease;
}

:deep(.dp__overlay_cell:hover) {
  background: rgba(219, 176, 103, 0.15);
  color: #dbb067;
}

:deep(.dp__overlay_cell_active) {
  background: linear-gradient(135deg, #dbb067 0%, #c9a05a 100%);
  color: white;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .custom-input {
    padding: 0.875rem 1rem;
    min-height: 50px;
  }

  .input-text,
  .input-placeholder {
    font-size: 0.9rem;
  }

  :deep(.dp__menu) {
    min-width: 280px;
    padding: 1rem;
  }
  
  :deep(.dp__cell_inner) {
    width: 32px;
    height: 32px;
    font-size: 0.875rem;
  }
}
</style>