<template>
  <aside class="sidebar-nav">
    <div class="logo">
      <img src="../assets/images/ARCH_Logo.svg" alt="ARCH Logo" class="logo-img" />
    </div>
    <nav class="nav-links">
      <RouterLink to="/admin" class="nav-link">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
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
  width: 256px;
  height: 100vh;
  overflow-y: auto;
  background-color: #111827;
  /* Gris oscuro para el sidebar */
  color: #d1d5db;
  /* Texto más claro */
  border-right: 1px solid #1f2937;
}

.logo {
  padding: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-img {
  height: 40px;
  /* Ajusta el tamaño según necesites */
  width: auto;
}

.nav-links {
  flex: 1;
  padding: 1rem;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  font-weight: 500;
  transition: background-color 0.2s, color 0.2s;
}

.nav-link:hover {
  background-color: #374151;
  /* Un gris más claro al pasar el ratón */
  color: white;
}

/* Clase activa del router */
.router-link-exact-active {
  background-color: #3b82f6;
  /* El azul de ARCH para el elemento activo */
  color: white;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.75rem;
}
</style>
