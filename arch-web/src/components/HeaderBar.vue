<template>
  <header class="header-bar">
    <div class="title">
      Panel de Administración
    </div>
    <div class="user-info">
      <span>
        Hola, <strong class="user-name">{{ userName }}</strong>
      </span>
      <button @click="handleLogout" class="logout-button">
        Cerrar Sesión
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()
const userName = computed(() => authStore.user?.name || 'Admin')
const handleLogout = () => {
  authStore.logout()
}
</script>

<style scoped>
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e2e8f0; /* border-gray-200 */
  background-color: white;
  padding: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); /* shadow-sm */
}
.title {
  font-size: 1.125rem; /* text-lg */
  font-weight: 600;
}
.user-info {
  display: flex;
  align-items: center;
}
.user-name {
  font-weight: 500;
}
.logout-button {
  margin-left: 1rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem; /* text-sm */
  font-weight: 500;
  color: white;
  background-color: #e53e3e; /* bg-red-600 */
  border: none;
  border-radius: 0.375rem; /* rounded-md */
  cursor: pointer;
}
.logout-button:hover {
  background-color: #c53030; /* hover:bg-red-700 */
}
</style>
