<!-- Ruta: arch-web/src/components/layouts/AdminLayout.vue -->
<template>
  <div class="admin-layout">
    <Sidebar />
    
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/layouts/SidebarComponet.vue'
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
}

.main-content {
  flex: 1;
  margin-left: 280px;
  min-height: 100vh;
  padding: 2rem;
  width: calc(100% - 280px);
  overflow-x: hidden;
}

@media (max-width: 1024px) {
  .main-content {
    margin-left: 260px;
    width: calc(100% - 260px);
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    width: 100%;
    padding: 1rem;
  }
}
</style>