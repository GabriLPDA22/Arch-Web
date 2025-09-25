<template>
  <div class="admin-layout">
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo-container">
          <div class="logo-circle">
            <img src="../../assets/images/ARCH_Logo.svg" alt="ARCH Logo" class="logo-image" />
          </div>
          <h2 v-if="!sidebarCollapsed" class="logo-text">ARCH</h2>
        </div>
        <button
          class="sidebar-toggle"
          @click="sidebarCollapsed = !sidebarCollapsed"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path :d="sidebarCollapsed ? 'M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z' : 'M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z'" />
          </svg>
        </button>
      </div>

      <nav class="navigation">
        <div class="nav-section">
          <RouterLink to="/admin/events" class="nav-item" active-class="active">
            <div class="nav-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z"/>
              </svg>
            </div>
            <span v-if="!sidebarCollapsed" class="nav-text">Events</span>
          </RouterLink>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="user-profile" :class="{ collapsed: sidebarCollapsed }">
          <div class="user-avatar">
            <div class="avatar-circle">{{ userInitial }}</div>
            <div class="user-status-dot"></div>
          </div>
          <div v-if="!sidebarCollapsed" class="user-info">
            <span class="user-name">{{ userName }}</span>
            <span class="user-role">Administrator</span>
          </div>
        </div>

        <button class="logout-btn" @click="handleLogout">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"/>
          </svg>
          <span v-if="!sidebarCollapsed">Logout</span>
        </button>
      </div>
    </aside>

    <main class="main-content">
      <header class="top-header">
        <div class="header-left">
          <button class="mobile-menu-btn" @click="mobileMenuOpen = !mobileMenuOpen">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"/>
            </svg>
          </button>
          <div class="breadcrumb">
            <span class="breadcrumb-item">Admin</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="breadcrumb-separator">
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
            </svg>
            <span class="breadcrumb-item current">{{ currentPageTitle }}</span>
          </div>
        </div>

        <div class="header-right">
          <div class="quick-actions">
          </div>
        </div>
      </header>

      <div class="page-content">
        <RouterView />
      </div>
    </main>

    <div v-if="mobileMenuOpen" class="mobile-overlay" @click="mobileMenuOpen = false"></div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { RouterView, RouterLink, useRoute } from 'vue-router';

const route = useRoute();

// State
const sidebarCollapsed = ref(false);
const mobileMenuOpen = ref(false);

// Computed
const userName = computed(() => 'Admin User');
const userInitial = computed(() => userName.value.charAt(0).toUpperCase());
const currentPageTitle = computed(() => {
  const routeName = route.name as string;
  const titles: Record<string, string> = {
    'admin': 'Dashboard',
    'admin-events': 'Events',
  };
  return titles[routeName] || 'Dashboard';
});

// Methods
const handleLogout = () => {
  console.log('Logout clicked');
};

// Handle responsive sidebar
const handleResize = () => {
  if (window.innerWidth < 1024) {
    sidebarCollapsed.value = true;
  }
};

// Lifecycle
onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

// Watch for route changes to close mobile menu
watch(() => route.path, () => {
  mobileMenuOpen.value = false;
});
</script>

<style scoped>
:root {
  --sidebar-width: 280px;
  --sidebar-collapsed-width: 80px;
  --header-height: 70px;
}

.admin-layout {
  display: flex;
  height: 100vh;
  background: #f8f9fa;
  color: #1a202c;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: var(--sidebar-width);
  background: #0d2954;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 100;
}

.sidebar.collapsed {
  width: var(--sidebar-collapsed-width);
}

.sidebar-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  min-height: var(--header-height);
  gap: 0.5rem;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-circle {
  width: 32px;
  height: 32px;
  background: #ffffff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.2rem;
  color: #0d2954;
  padding: 4px;
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
  color: #dbb067;
}

.sidebar-toggle {
  background: rgba(219, 176, 103, 0.1);
  border: none;
  border-radius: 0.5rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.7);
  flex-shrink: 0;
}

.sidebar-toggle:hover {
  background: rgba(219, 176, 103, 0.2);
  color: #dbb067;
}

.navigation {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 2rem;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s ease;
  position: relative;
  margin: 0.25rem 1rem;
  border-radius: 0.5rem;
}

.nav-item:hover {
  background: rgba(219, 176, 103, 0.1);
  color: #dbb067;
  transform: translateX(2px);
}

.nav-item.active {
  background: #dbb067;
  color: #0d2954;
  font-weight: 600;
}

.nav-icon {
  min-width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-text {
  margin-left: 1rem;
  font-weight: 500;
  font-size: 0.95rem;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: rgba(219, 176, 103, 0.1);
  border-radius: 0.75rem;
}

.user-profile.collapsed {
  justify-content: center;
}

.user-avatar {
  position: relative;
  width: 40px;
  height: 40px;
}

.avatar-circle {
  width: 100%;
  height: 100%;
  background: #dbb067;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #0d2954;
  font-size: 1rem;
}

.user-status-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background: #10b981;
  border: 2px solid #0d2954;
  border-radius: 50%;
}

.user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.logout-btn {
  width: 100%;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #f87171;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.25);
  border-color: rgba(239, 68, 68, 0.4);
  transform: translateY(-1px);
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: #ffffff;
}

.top-header {
  height: var(--header-height);
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 2rem;
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #718096;
  font-size: 0.9rem;
}

.breadcrumb-item.current {
  color: #1a202c;
  font-weight: 600;
}

.breadcrumb-separator {
  color: #cbd5e0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.quick-actions {
  display: flex;
  gap: 0.5rem;
}

.page-content {
  flex: 1;
  overflow: auto;
  background: #f8f9fa;
}

/* Mobile Styles */
@media (max-width: 1024px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    transform: translateX(-100%);
    z-index: 200;
  }

  .sidebar.collapsed {
    width: var(--sidebar-width);
  }

  .main-content {
    margin-left: 0;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .mobile-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 150;
  }

}

/* Scrollbar Styles */
.navigation::-webkit-scrollbar {
  width: 4px;
}

.navigation::-webkit-scrollbar-track {
  background: transparent;
}

.navigation::-webkit-scrollbar-thumb {
  background: rgba(219, 176, 103, 0.3);
  border-radius: 2px;
}

.navigation::-webkit-scrollbar-thumb:hover {
  background: rgba(219, 176, 103, 0.5);
}
</style>
