<template>
  <div class="dashboard-content">
    <h1 class="title">
      ¡Hola de nuevo, {{ userName }}!
    </h1>
    <p class="subtitle">
      Aquí tienes un resumen de la actividad de tu app.
    </p>

    <div class="stats-grid">
      <div class="stat-card">
        <h3 class="stat-title">Usuarios Totales</h3>
        <p class="stat-value">1,234</p>
      </div>
      <div class="stat-card">
        <h3 class="stat-title">Eventos Activos</h3>
        <p class="stat-value">42</p>
      </div>
      <div class="stat-card">
        <h3 class="stat-title">Nuevos Registros (Hoy)</h3>
        <p class="stat-value">58</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()
const userName = computed(() => authStore.user?.name || 'Admin')
</script>

<style scoped>
.title {
  font-size: 2rem; /* text-3xl */
  font-weight: 700;
  color: #1a202c; /* text-gray-900 */
}
.subtitle {
  margin-top: 0.25rem;
  font-size: 1.125rem; /* text-lg */
  color: #4a5568; /* text-gray-700 */
}

/* Grid para las estadísticas */
.stats-grid {
  display: grid;
  /* 3 columnas en escritorio, 1 en móvil */
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem; /* 24px */
  margin-top: 2rem; /* 32px */
}

.stat-card {
  background-color: white;
  padding: 2rem; /* 32px */
  border-radius: 12px; /* rounded-xl */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* Sombra suave */
  transition: all 0.2s ease-in-out;
}
.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}
.stat-title {
  font-size: 0.875rem; /* text-sm */
  font-weight: 600;
  color: #718096; /* text-gray-500 */
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.stat-value {
  margin-top: 0.5rem;
  font-size: 2.25rem; /* text-4xl */
  font-weight: 700;
  color: #2d3748; /* text-gray-800 */
}
</style>
