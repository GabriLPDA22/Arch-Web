<!-- Ruta: arch-web/src/components/Sidebar.vue -->
<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo-container">
        <img src="../assets/images/ARCH_Logo.svg" alt="ARCH Logo" class="logo-image" />
        <div class="logo-text-wrapper">
          <h2 class="logo-title">ARCH</h2>
          <p class="logo-subtitle">Admin Panel</p>
        </div>
      </div>
    </div>

    <nav class="navigation">
      <RouterLink to="/admin/events" class="nav-item" active-class="active">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" class="nav-icon">
          <path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z"/>
        </svg>
        <span class="nav-text">Events</span>
      </RouterLink>
    </nav>

    <div class="sidebar-footer">
      <div class="user-profile">
        <div class="user-avatar">
          <div class="avatar-circle">{{ userInitial }}</div>
        </div>
        <div class="user-info">
          <span class="user-name">{{ userName }}</span>
          <span class="user-role">Administrator</span>
        </div>
      </div>

      <button class="logout-btn" @click="handleLogout">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"/>
        </svg>
        <span>Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'  // o prueba con '../stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const userName = computed(() => authStore.user?.email?.split('@')[0] || 'Admin')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  background: #0d2954;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 100;
  overflow-y: auto;
}

.sidebar-header {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-image {
  width: 48px;
  height: auto;
}

.logo-text-wrapper {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  letter-spacing: 0.05em;
}

.logo-subtitle {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.navigation {
  flex: 1;
  padding: 2rem 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 1rem;
}

.nav-item:hover {
  background: rgba(219, 176, 103, 0.1);
  color: #dbb067;
}

.nav-item.active {
  background: #dbb067;
  color: #0d2954;
  font-weight: 600;
}

.nav-icon {
  flex-shrink: 0;
}

.nav-text {
  flex: 1;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: rgba(219, 176, 103, 0.1);
  border-radius: 12px;
}

.user-avatar {
  position: relative;
  flex-shrink: 0;
}

.avatar-circle {
  width: 40px;
  height: 40px;
  background: #dbb067;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #0d2954;
  font-size: 1rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.user-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: capitalize;
}

.user-role {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.logout-btn {
  width: 100%;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  font-size: 0.95rem;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.25);
  border-color: rgba(239, 68, 68, 0.5);
  transform: translateY(-1px);
}

.logout-btn:active {
  transform: translateY(0);
}

@media (max-width: 1024px) {
  .sidebar {
    width: 240px;
  }

  .logo-image {
    width: 40px;
  }

  .logo-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    position: relative;
    height: auto;
  }

  .navigation {
    padding: 1rem;
  }
}
</style>