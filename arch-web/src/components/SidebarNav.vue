<template>
  <aside class="sidebar-nav">
    <div class="logo">
      Mi Dashboard
    </div>
    <nav class="nav-links">
      <RouterLink to="/admin" class="nav-link">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <span>Dashboard</span>
      </RouterLink>
      </nav>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.sidebar-nav {
  display: flex;
  flex-direction: column;
  width: 256px; /* 16rem */
  height: 100vh;
  overflow-y: auto;
  background-color: #1a202c; /* gray-900 */
  color: #cbd5e0; /* gray-300 */
}
.logo {
  padding: 1rem;
  text-align: center;
  font-size: 1.5rem; /* 2xl */
  font-weight: 700;
  color: white;
}
.nav-links {
  flex: 1;
  padding: 1rem;
}
.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem; /* rounded-md */
  text-decoration: none;
  color: inherit;
}
.nav-link:hover {
  background-color: #4a5568; /* gray-700 */
  color: white;
}
/* Clase activa del router */
.nav-link.router-link-active {
  background-color: #4a5568; /* gray-700 */
  color: white;
}
.icon {
  width: 1.5rem; /* h-6 w-6 */
  height: 1.5rem;
  margin-right: 0.5rem; /* space-x-2 */
}
</style>
