<template>
  <div class="calendar-wrapper" ref="wrapperRef">
    <div class="calendar-input" @click="toggleCalendar" :class="{ open: isOpen, disabled }">
      <div class="input-content">
        <svg class="icon calendar-icon" viewBox="0 0 24 24">
          <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M15.6947 13.7H15.7037M15.6947 16.7H15.7037M11.9955 13.7H12.0045M11.9955 16.7H12.0045M8.29431 13.7H8.30329M8.29431 16.7H8.30329" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span v-if="displayValue" class="value">{{ displayValue }}</span>
        <span v-else class="placeholder">{{ placeholder }}</span>
      </div>
      <svg class="icon chevron-icon" :class="{ rotate: isOpen }" viewBox="0 0 24 24">
        <path d="M19 9L12 16L5 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <Transition name="calendar-fade">
      <div v-if="isOpen" class="calendar-dropdown">
        <!-- Header con navegaciÃ³n de mes/aÃ±o -->
        <div class="calendar-header">
          <button type="button" @click="previousMonth" class="nav-button">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M15 19L8 12L15 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div class="month-year">
            {{ monthNames[currentMonth] }} {{ currentYear }}
          </div>
          <button type="button" @click="nextMonth" class="nav-button">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- DÃ­as de la semana -->
        <div class="weekdays">
          <div v-for="day in weekDays" :key="day" class="weekday">{{ day }}</div>
        </div>

        <!-- Grid de dÃ­as -->
        <div class="days-grid">
          <button
            v-for="day in calendarDays"
            :key="`${day.date}-${day.month}`"
            type="button"
            @click="selectDate(day)"
            class="day-button"
            :class="{
              'other-month': day.isOtherMonth,
              'selected': isSelected(day),
              'today': isToday(day),
              'disabled': day.disabled
            }"
            :disabled="day.disabled"
          >
            {{ day.day }}
          </button>
        </div>

        <!-- Selector de hora -->
        <div class="time-picker">
          <div class="time-section">
            <label class="time-label">Hour</label>
            <div class="time-input-wrapper">
              <button type="button" @click="incrementHour" class="time-button">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path d="M18 15L12 9L6 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <input
                v-model.number="selectedHour"
                type="number"
                min="0"
                max="23"
                class="time-input"
                @blur="validateHour"
              />
              <button type="button" @click="decrementHour" class="time-button">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <span class="time-separator">:</span>

          <div class="time-section">
            <label class="time-label">Minute</label>
            <div class="time-input-wrapper">
              <button type="button" @click="incrementMinute" class="time-button">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path d="M18 15L12 9L6 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <input
                v-model.number="selectedMinute"
                type="number"
                min="0"
                max="59"
                class="time-input"
                @blur="validateMinute"
              />
              <button type="button" @click="decrementMinute" class="time-button">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Botones de acciÃ³n -->
        <div class="calendar-actions">
          <button type="button" @click="clearSelection" class="action-button clear-button">
            Clear
          </button>
          <button type="button" @click="confirmSelection" class="action-button confirm-button">
            Confirm
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

interface Props {
  modelValue: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  minDate?: Date
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select date and time',
  required: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isOpen = ref(false)
const wrapperRef = ref<HTMLElement | null>(null)

const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())

const selectedDay = ref<number | null>(null)
const selectedMonth = ref<number | null>(null)
const selectedYear = ref<number | null>(null)
const selectedHour = ref(12)
const selectedMinute = ref(0)

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

// Inicializar desde modelValue
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    const date = new Date(newVal)
    selectedDay.value = date.getDate()
    selectedMonth.value = date.getMonth()
    selectedYear.value = date.getFullYear()
    selectedHour.value = date.getHours()
    selectedMinute.value = date.getMinutes()
    currentMonth.value = date.getMonth()
    currentYear.value = date.getFullYear()
  }
}, { immediate: true })

const displayValue = computed(() => {
  if (!props.modelValue) return ''
  
  const date = new Date(props.modelValue)
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  
  return new Intl.DateTimeFormat('en-GB', options).format(date)
})

interface CalendarDay {
  day: number
  month: number
  year: number
  date: string
  isOtherMonth: boolean
  disabled: boolean
}

const calendarDays = computed<CalendarDay[]>(() => {
  const days: CalendarDay[] = []
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const prevLastDay = new Date(currentYear.value, currentMonth.value, 0)
  
  const firstDayOfWeek = firstDay.getDay()
  const lastDayNum = lastDay.getDate()
  const prevLastDayNum = prevLastDay.getDate()
  
  // DÃ­as del mes anterior
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevLastDayNum - i
    const month = currentMonth.value - 1
    const year = month < 0 ? currentYear.value - 1 : currentYear.value
    const actualMonth = month < 0 ? 11 : month
    
    days.push({
      day,
      month: actualMonth,
      year,
      date: `${year}-${actualMonth + 1}-${day}`,
      isOtherMonth: true,
      disabled: false
    })
  }
  
  // DÃ­as del mes actual
  for (let day = 1; day <= lastDayNum; day++) {
    const date = new Date(currentYear.value, currentMonth.value, day)
    // Permitir el mismo día que minDate, solo deshabilitar días anteriores
    let isDisabled = false
    if (props.minDate) {
      const minDateOnly = new Date(props.minDate.getFullYear(), props.minDate.getMonth(), props.minDate.getDate())
      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      isDisabled = dateOnly < minDateOnly
    }
    
    days.push({
      day,
      month: currentMonth.value,
      year: currentYear.value,
      date: `${currentYear.value}-${currentMonth.value + 1}-${day}`,
      isOtherMonth: false,
      disabled: isDisabled
    })
  }
  
  // DÃ­as del siguiente mes
  const remainingDays = 42 - days.length
  for (let day = 1; day <= remainingDays; day++) {
    const month = currentMonth.value + 1
    const year = month > 11 ? currentYear.value + 1 : currentYear.value
    const actualMonth = month > 11 ? 0 : month
    
    days.push({
      day,
      month: actualMonth,
      year,
      date: `${year}-${actualMonth + 1}-${day}`,
      isOtherMonth: true,
      disabled: false
    })
  }
  
  return days
})

const isSelected = (day: CalendarDay) => {
  return (
    day.day === selectedDay.value &&
    day.month === selectedMonth.value &&
    day.year === selectedYear.value
  )
}

const isToday = (day: CalendarDay) => {
  const today = new Date()
  return (
    day.day === today.getDate() &&
    day.month === today.getMonth() &&
    day.year === today.getFullYear()
  )
}

const toggleCalendar = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

const selectDate = (day: CalendarDay) => {
  if (day.disabled) return
  
  selectedDay.value = day.day
  selectedMonth.value = day.month
  selectedYear.value = day.year
  
  if (day.isOtherMonth) {
    currentMonth.value = day.month
    currentYear.value = day.year
  }
}

const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const incrementHour = () => {
  selectedHour.value = selectedHour.value >= 23 ? 0 : selectedHour.value + 1
}

const decrementHour = () => {
  selectedHour.value = selectedHour.value <= 0 ? 23 : selectedHour.value - 1
}

const incrementMinute = () => {
  selectedMinute.value = selectedMinute.value >= 59 ? 0 : selectedMinute.value + 1
}

const decrementMinute = () => {
  selectedMinute.value = selectedMinute.value <= 0 ? 59 : selectedMinute.value - 1
}

const validateHour = () => {
  if (selectedHour.value < 0) selectedHour.value = 0
  if (selectedHour.value > 23) selectedHour.value = 23
}

const validateMinute = () => {
  if (selectedMinute.value < 0) selectedMinute.value = 0
  if (selectedMinute.value > 59) selectedMinute.value = 59
}

const confirmSelection = () => {
  if (selectedDay.value !== null && selectedMonth.value !== null && selectedYear.value !== null) {
    const date = new Date(
      selectedYear.value,
      selectedMonth.value,
      selectedDay.value,
      selectedHour.value,
      selectedMinute.value
    )
    
    const offset = date.getTimezoneOffset() * 60000
    const localDate = new Date(date.getTime() - offset)
    const isoString = localDate.toISOString().slice(0, 16)
    
    emit('update:modelValue', isoString)
    isOpen.value = false
  }
}

const clearSelection = () => {
  emit('update:modelValue', '')
  selectedDay.value = null
  selectedMonth.value = null
  selectedYear.value = null
  isOpen.value = false
}

// Cerrar al hacer click fuera
const handleClickOutside = (event: MouseEvent) => {
  if (wrapperRef.value && !wrapperRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.calendar-wrapper {
  position: relative;
  width: 100%;
}

.calendar-input {
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

.calendar-input:hover:not(.disabled) {
  border-color: #dbb067;
  background: #fafafa;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(219, 176, 103, 0.1);
}

.calendar-input.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f5f5f5;
}

.input-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.icon {
  flex-shrink: 0;
  fill: none;
}

.calendar-icon {
  width: 20px;
  height: 20px;
  color: #dbb067;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.calendar-input:hover .calendar-icon {
  transform: scale(1.1);
}

.value {
  font-size: 1rem;
  font-weight: 500;
  color: #1a202c;
}

.placeholder {
  font-size: 1rem;
  color: #a0aec0;
}

.chevron-icon {
  width: 20px;
  height: 20px;
  color: #718096;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.chevron-icon.rotate {
  transform: rotate(180deg);
}

.calendar-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  padding: 1.5rem;
  z-index: 1000;
  min-width: 320px;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.nav-button {
  background: transparent;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-button:hover {
  background: rgba(219, 176, 103, 0.1);
  color: #dbb067;
  transform: scale(1.1);
}

.month-year {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a202c;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.weekday {
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #718096;
  padding: 0.5rem;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
  margin-bottom: 1.5rem;
}

.day-button {
  aspect-ratio: 1;
  border: none;
  background: transparent;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: #1a202c;
  transition: all 0.2s ease;
  padding: 0.5rem;
}

.day-button:hover:not(.disabled) {
  background: rgba(219, 176, 103, 0.1);
  color: #dbb067;
  transform: scale(1.05);
}

.day-button.other-month {
  color: #cbd5e0;
}

.day-button.selected {
  background: linear-gradient(135deg, #dbb067 0%, #c9a05a 100%);
  color: white;
  font-weight: 700;
}

.day-button.today:not(.selected) {
  border: 2px solid #dbb067;
  font-weight: 600;
}

.day-button.disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.time-picker {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
}

.time-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.time-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.time-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.time-button {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  padding: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #718096;
  transition: all 0.2s ease;
}

.time-button:hover {
  background: rgba(219, 176, 103, 0.1);
  border-color: #dbb067;
  color: #dbb067;
}

.time-input {
  width: 60px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.5rem;
  background: #ffffff;
  transition: all 0.2s ease;
}

.time-input:focus {
  outline: none;
  border-color: #dbb067;
  box-shadow: 0 0 0 3px rgba(219, 176, 103, 0.2);
}

/* Remove spinner arrows */
.time-input::-webkit-inner-spin-button,
.time-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.time-input[type=number] {
  -moz-appearance: textfield;
}

.time-separator {
  font-size: 2rem;
  font-weight: 700;
  color: #dbb067;
  margin: 0 0.5rem;
}

.calendar-actions {
  display: flex;
  gap: 0.75rem;
}

.action-button {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.9rem;
}

.clear-button {
  background: #f1f5f9;
  color: #64748b;
}

.clear-button:hover {
  background: #e2e8f0;
  transform: translateY(-2px);
}

.confirm-button {
  background: linear-gradient(135deg, #dbb067 0%, #c9a05a 100%);
  color: white;
}

.confirm-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(219, 176, 103, 0.3);
}

/* Animaciones */
.calendar-fade-enter-active {
  animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.calendar-fade-leave-active {
  animation: slideUp 0.2s cubic-bezier(0.4, 0, 0.2, 1);
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

@keyframes slideUp {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
}

@media (max-width: 768px) {
  .calendar-dropdown {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
  }
}
</style>