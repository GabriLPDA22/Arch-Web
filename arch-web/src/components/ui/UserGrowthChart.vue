<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3 class="chart-title">User Growth</h3>
      <div class="chart-controls">
        <div class="chart-stats">
          <div class="stat-item">
            <span class="stat-label">Total:</span>
            <span class="stat-value">{{ totalUsers }}</span>
          </div>
        </div>
        <div class="type-filter">
          <label class="filter-label">Filter by type:</label>
          <select v-model="selectedUserType" class="type-select">
            <option value="">All types</option>
            <option value="user">Oxford (Students/Alumni)</option>
            <option value="staff-user">Staff</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="scanner">Organizer</option>
          </select>
        </div>
      </div>
    </div>
    <div v-if="loading" class="chart-loading">
      <div class="spinner"></div>
      <p>Loading data...</p>
    </div>
    <div v-else class="chart-wrapper">
      <canvas ref="chartCanvas"></canvas>
      <div v-if="!hasData && totalUsers > 0" class="chart-info">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5V18H13V16.5H11M11,6V14H13V6H11Z" />
        </svg>
        <p>Users do not have registration dates available</p>
        <p class="info-subtitle">Total users: {{ totalUsers }}</p>
      </div>
      <div v-else-if="!hasData" class="chart-info">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5V18H13V16.5H11M11,6V14H13V6H11Z" />
        </svg>
        <p>No users registered yet</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartConfiguration,
} from 'chart.js'

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface Props {
  users: Array<{ 
    createdAt?: string
    userType?: string
    userRole?: string | null
    name?: string
    email?: string
  }>
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null
const selectedUserType = ref<string>('')

// Tipo para los datos de la gráfica
interface ChartDataResult {
  labels: string[]
  datasets: Array<{
    label: string
    cumulativeData: number[]
    dailyData: number[]
    color: string
    borderColor: string
    backgroundColor: string
  }>
  rawDates: string[]
}

// Función para parsear fechas en formato "2025-11-06 11:04:14.987 +0100"
const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null
  
  try {
    // Intentar parsear el formato con timezone
    // Formato: "2025-11-06 11:04:14.987 +0100"
    const cleaned = dateString.trim()
    
    // Si tiene formato ISO estándar, usar directamente
    if (cleaned.includes('T') || cleaned.includes('Z')) {
      return new Date(cleaned)
    }
    
    // Si tiene formato "YYYY-MM-DD HH:mm:ss.sss +HHMM"
    const timezoneMatch = cleaned.match(/([+-]\d{4})$/)
    if (timezoneMatch) {
      // Extraer la parte sin timezone
      const datePart = cleaned.replace(/\s*[+-]\d{4}$/, '')
      // Intentar parsear
      const date = new Date(datePart)
      if (!isNaN(date.getTime())) {
        return date
      }
    }
    
    // Intentar parseo directo
    const date = new Date(cleaned)
    if (!isNaN(date.getTime())) {
      return date
    }
    
    return null
  } catch (error) {
    console.warn('Error parsing date:', dateString, error)
    return null
  }
}

// Obtener tipos de usuario únicos
const availableUserTypes = computed(() => {
  if (!props.users || props.users.length === 0) return []
  const types = new Set<string>()
  props.users.forEach(u => {
    if (u.userType) {
      types.add(u.userType)
    }
  })
  return Array.from(types).sort()
})

// Filtrar usuarios según el tipo seleccionado
const filteredUsers = computed(() => {
  if (!props.users) return []
  if (!selectedUserType.value) return props.users
  return props.users.filter(u => u.userType === selectedUserType.value)
})

// Procesar datos de usuarios para la gráfica
const chartData = computed((): ChartDataResult => {
  const usersToProcess = filteredUsers.value
  
  console.log('🔍 [CHART] Iniciando procesamiento de datos')
  console.log('🔍 [CHART] Total usuarios recibidos:', usersToProcess?.length || 0)
  console.log('🔍 [CHART] Primeros 3 usuarios:', usersToProcess?.slice(0, 3).map(u => ({
    name: u.name,
    userType: u.userType,
    createdAt: u.createdAt,
    hasCreatedAt: !!u.createdAt,
    createdAtType: typeof u.createdAt
  })))
  
  if (!usersToProcess || usersToProcess.length === 0) {
    console.warn('⚠️ [CHART] No hay usuarios para procesar')
    return { labels: [], datasets: [], rawDates: [] }
  }

  // Filtrar usuarios que tienen createdAt válido
  const usersWithDate = usersToProcess.filter((u) => {
    if (!u.createdAt) {
      console.warn('⚠️ [CHART] Usuario sin createdAt:', {
        name: u.name,
        email: u.email,
        userType: u.userType,
        allFields: Object.keys(u)
      })
      return false
    }
    const date = parseDate(u.createdAt)
    if (!date) {
      console.error('❌ [CHART] No se pudo parsear fecha:', {
        createdAt: u.createdAt,
        createdAtType: typeof u.createdAt,
        user: u.name
      })
    } else {
      console.debug('✅ [CHART] Fecha parseada correctamente:', {
        original: u.createdAt,
        parsed: date.toISOString(),
        user: u.name
      })
    }
    return date !== null
  })
  
  console.log(`📊 [CHART] Usuarios con fecha válida: ${usersWithDate.length} de ${usersToProcess.length}`)
  
  if (usersWithDate.length === 0) {
    console.error('❌ [CHART] NINGÚN usuario tiene fecha válida. Revisar backend.')
  }

  if (usersWithDate.length === 0) {
    return { labels: [], datasets: [], rawDates: [] }
  }

  // Agrupar por tipo de usuario y fecha
  const usersByTypeAndDate = new Map<string, Map<string, number>>()
  
  // Colores para cada tipo de usuario
  const typeColors: Record<string, { border: string; background: string }> = {
    'user': { border: '#4f46e5', background: 'rgba(79, 70, 229, 0.1)' },
    'staff-user': { border: '#0ea5e9', background: 'rgba(14, 165, 233, 0.1)' },
    'admin': { border: '#dc2626', background: 'rgba(220, 38, 38, 0.1)' },
    'moderator': { border: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)' },
    'scanner': { border: '#10b981', background: 'rgba(16, 185, 129, 0.1)' },
  }

  usersWithDate.forEach((user) => {
    if (!user.createdAt) return
    
    const date = parseDate(user.createdAt)
    if (!date) return
    
    const userType = user.userType || 'unknown'
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateKey = `${year}-${month}-${day}`
    
    if (!usersByTypeAndDate.has(userType)) {
      usersByTypeAndDate.set(userType, new Map<string, number>())
    }
    
    const typeMap = usersByTypeAndDate.get(userType)!
    typeMap.set(dateKey, (typeMap.get(dateKey) || 0) + 1)
  })

  // Obtener todas las fechas únicas y ordenarlas
  const allDates = new Set<string>()
  usersByTypeAndDate.forEach((dateMap) => {
    dateMap.forEach((_, date) => allDates.add(date))
  })
  const sortedDates = Array.from(allDates).sort()

  if (sortedDates.length === 0) {
    return { labels: [], datasets: [], rawDates: [] }
  }

  // Crear datasets para cada tipo de usuario
  const datasets: ChartDataResult['datasets'] = []
  
  usersByTypeAndDate.forEach((dateMap, userType) => {
    let cumulative = 0
    const cumulativeData: number[] = []
    const dailyData: number[] = []
    
    sortedDates.forEach((date) => {
      const count = dateMap.get(date) || 0
      cumulative += count
      cumulativeData.push(cumulative)
      dailyData.push(count)
    })
    
    const colors = typeColors[userType] || { border: '#6b7280', background: 'rgba(107, 114, 128, 0.1)' }
    const typeLabel = userType === 'user' ? 'Oxford' : 
                     userType === 'staff-user' ? 'Staff' :
                     userType === 'scanner' ? 'Organizer' :
                     userType.charAt(0).toUpperCase() + userType.slice(1)
    
    datasets.push({
      label: typeLabel,
      cumulativeData,
      dailyData,
      color: colors.border,
      borderColor: colors.border,
      backgroundColor: colors.background,
    })
  })

  return {
    labels: sortedDates.map((date) => {
      try {
        const [year, month, day] = date.split('-').map(Number)
        const d = new Date(year, month - 1, day)
        return d.toLocaleDateString('es-ES', { 
          month: 'short', 
          day: 'numeric',
          year: sortedDates.length > 30 ? undefined : 'numeric'
        })
      } catch (error) {
        return date
      }
    }),
    datasets,
    rawDates: sortedDates,
  }
})

const hasData = computed(() => {
  return chartData.value.datasets.length > 0 && chartData.value.labels.length > 0
})

const totalUsers = computed(() => {
  return props.users?.length || 0
})

const growthPercentage = computed((): number | null => {
  const data = chartData.value
  if (!data || data.datasets.length === 0 || data.labels.length < 2) return null
  
  // Calcular el total acumulado en el primer día y en el último día
  const firstDayTotal = data.datasets.reduce((acc, dataset) => {
    return acc + (dataset.cumulativeData[0] || 0)
  }, 0)
  
  const lastDayTotal = data.datasets.reduce((acc, dataset) => {
    const lastIndex = dataset.cumulativeData.length - 1
    return acc + (dataset.cumulativeData[lastIndex] || 0)
  }, 0)
  
  if (firstDayTotal === 0) {
    // Si empezó en 0, el crecimiento es infinito, mejor mostrar null o un mensaje
    return null
  }
  
  // Calcular crecimiento porcentual
  const growth = ((lastDayTotal - firstDayTotal) / firstDayTotal) * 100
  
  // Limitar a un máximo razonable (ej: 10000%) para evitar valores absurdos
  if (Math.abs(growth) > 10000) {
    return null
  }
  
  return growth
})

const createChart = () => {
  console.log('🎨 [CHART] createChart llamado')
  console.log('🎨 [CHART] chartCanvas.value:', !!chartCanvas.value)
  console.log('🎨 [CHART] hasData.value:', hasData.value)
  
  if (!chartCanvas.value) {
    console.warn('⚠️ [CHART] No hay canvas disponible')
    return
  }
  
  if (!hasData.value) {
    console.warn('⚠️ [CHART] No hay datos para mostrar')
    return
  }

  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) {
    console.error('❌ [CHART] No se pudo obtener contexto del canvas')
    return
  }

  // Destruir gráfica anterior si existe
  if (chartInstance) {
    console.log('🗑️ [CHART] Destruyendo gráfica anterior')
    chartInstance.destroy()
    chartInstance = null
  }

  const data = chartData.value

  console.log('📊 [CHART] Datos para gráfica:', {
    labelsCount: data.labels.length,
    datasetsCount: data.datasets.length,
    labels: data.labels.slice(0, 5),
    datasets: data.datasets.map(d => ({
      label: d.label,
      dataPoints: d.cumulativeData.length,
      firstValue: d.cumulativeData[0],
      lastValue: d.cumulativeData[d.cumulativeData.length - 1]
    }))
  })

  if (!data || !data.labels || data.datasets.length === 0) {
    console.error('❌ [CHART] Datos inválidos para crear gráfica')
    return
  }

  // Crear datasets para la gráfica
  const chartDatasets: any[] = []
  
  // Agregar línea de acumulado total si hay múltiples tipos o si no hay filtro
  if (!selectedUserType.value && data.datasets.length > 1) {
    const totalCumulative: number[] = []
    data.labels.forEach((_, index) => {
      const sum = data.datasets.reduce((acc, ds) => acc + (ds.cumulativeData[index] || 0), 0)
      totalCumulative.push(sum)
    })
    
    chartDatasets.push({
      label: 'Total',
      data: totalCumulative,
      borderColor: '#0d2954',
      backgroundColor: 'rgba(13, 41, 84, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: '#0d2954',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
    })
  }
  
  // Agregar línea acumulada para cada tipo
  data.datasets.forEach((dataset) => {
    chartDatasets.push({
      label: dataset.label,
      data: dataset.cumulativeData,
      borderColor: dataset.borderColor,
      backgroundColor: dataset.backgroundColor,
      borderWidth: 2,
      fill: false,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 5,
      pointBackgroundColor: dataset.borderColor,
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
    })
  })
  

  const config: ChartConfiguration<'line'> = {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: chartDatasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 15,
            font: {
              size: 12,
              weight: 'bold',
            },
            color: '#475569',
          },
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 14,
            weight: 'bold',
          },
          bodyFont: {
            size: 13,
          },
          borderColor: '#e2e8f0',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || ''
              if (label) {
                label += ': '
              }
              const yValue = context.parsed.y
              if (yValue !== null && yValue !== undefined) {
                label += yValue.toLocaleString('en-US')
                label += ' users'
              }
              return label
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: '#64748b',
            font: {
              size: 11,
            },
            maxRotation: 45,
            minRotation: 45,
          },
        },
        y: {
          beginAtZero: true,
          position: 'left',
          grid: {
            color: 'rgba(226, 232, 240, 0.5)',
          },
          ticks: {
            color: '#64748b',
            font: {
              size: 11,
            },
            callback: function (value) {
              return value.toLocaleString('es-ES')
            },
          },
          title: {
            display: true,
            text: 'Total Users',
            color: '#475569',
            font: {
              size: 12,
              weight: 'bold',
            },
          },
        },
      },
    },
  }

  try {
    chartInstance = new Chart(ctx, config)
    console.log('✅ [CHART] Gráfica creada exitosamente')
  } catch (error) {
    console.error('❌ [CHART] Error al crear gráfica:', error)
  }
}

watch(
  () => [props.users, props.loading, selectedUserType.value],
  () => {
    console.log('👀 [CHART] Watch activado:', {
      usersCount: props.users?.length,
      loading: props.loading,
      selectedType: selectedUserType.value
    })
    if (!props.loading) {
      setTimeout(() => {
        createChart()
      }, 200)
    }
  },
  { deep: true, immediate: true }
)

onMounted(() => {
  console.log('🚀 [CHART] Componente montado')
  console.log('🚀 [CHART] loading:', props.loading)
  console.log('🚀 [CHART] users:', props.users?.length)
  
  if (!props.loading) {
    setTimeout(() => {
      createChart()
    }, 300)
  }
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>

<style scoped>
.chart-container {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.chart-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.chart-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.type-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.type-filter .filter-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.type-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  color: #1e293b;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.type-select:hover {
  border-color: #dbb067;
}

.type-select:focus {
  outline: none;
  border-color: #dbb067;
  box-shadow: 0 0 0 3px rgba(219, 176, 103, 0.1);
}

.chart-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.chart-stats {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.stat-value {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
}

.stat-value.positive {
  color: #059669;
}

.stat-value.negative {
  color: #dc2626;
}

.chart-wrapper {
  position: relative;
  height: 400px;
  width: 100%;
}

.chart-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #94a3b8;
}

.chart-loading p {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #64748b;
}

.chart-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #94a3b8;
  text-align: center;
  padding: 2rem;
}

.chart-info svg {
  color: #cbd5e1;
  margin-bottom: 1rem;
}

.chart-info p {
  margin: 0.5rem 0;
  font-size: 0.875rem;
  color: #64748b;
}

.chart-info .info-subtitle {
  font-weight: 600;
  color: #475569;
  font-size: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #dbb067;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.chart-empty svg {
  color: #cbd5e1;
}
</style>
