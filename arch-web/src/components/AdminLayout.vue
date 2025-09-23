<template>
  <div class="admin-layout">
    <SidebarNav />
    <div class="main-container">
      <HeaderBar />
      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import SidebarNav from '@/components/SidebarNav.vue'
import HeaderBar from '@/components/HeaderBar.vue'
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #f4f7f6;
}
.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background-color: #f4f7f6;
}
</style>
