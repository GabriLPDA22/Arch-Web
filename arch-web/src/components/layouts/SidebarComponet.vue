<!-- ============================================== -->
<!-- RUTA: src/components/layouts/SidebarComponet.vue -->
<!-- ACCIÓN: REEMPLAZAR archivo completo               -->
<!-- ============================================== -->

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo-container">
        <img src="@/assets/images/ARCH_Logo.svg" alt="ARCH Logo" class="logo-image" />
        <div class="logo-text-wrapper">
          <h2 class="logo-title">ARCH</h2>
          <p class="logo-subtitle">Admin Panel</p>
        </div>
      </div>
    </div>

    <nav class="navigation">
      <!-- Administración -->
      <div v-if="authStore.canManagePanel" class="nav-section">
        <div class="section-label">Administration</div>
        <RouterLink to="/admin/events" class="nav-item" active-class="active">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" class="nav-icon">
            <path
              d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z"
            />
          </svg>
          <span class="nav-text">Events</span>
        </RouterLink>

        <RouterLink
          v-if="authStore.isAdmin"
          to="/admin/users"
          class="nav-item"
          active-class="active"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" class="nav-icon">
            <path
              d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
            />
          </svg>
          <span class="nav-text">Users</span>
        </RouterLink>

        <RouterLink
          v-if="authStore.isAdmin"
          to="/admin/staff/verification"
          class="nav-item"
          active-class="active"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" class="nav-icon">
            <path
              d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"
            />
          </svg>
          <span class="nav-text">Staff Requests</span>
        </RouterLink>

        <RouterLink
          v-if="authStore.isAdmin"
          to="/admin/alumni/verification"
          class="nav-item"
          active-class="active"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" class="nav-icon">
            <path
              d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z"
            />
          </svg>
          <span class="nav-text">Alumni Requests</span>
        </RouterLink>

        <!-- ✅ NUEVO: Reports Link -->
        <RouterLink
          v-if="authStore.isAdmin"
          to="/admin/reports"
          class="nav-item"
          active-class="active"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" class="nav-icon">
            <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" />
          </svg>
          <span class="nav-text">Reports</span>
        </RouterLink>

        <!-- ✅ NUEVO: Organizations Link (solo para admins del sistema) -->
        <RouterLink
          v-if="authStore.isAdmin"
          to="/admin/organizations"
          class="nav-item"
          active-class="active"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" class="nav-icon">
            <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,12C6.33,12 7,12.67 7,13.5C7,14.33 6.33,15 5.5,15C4.67,15 4,14.33 4,13.5C4,12.67 4.67,12 5.5,12M18.5,12C19.33,12 20,12.67 20,13.5C20,14.33 19.33,15 18.5,15C17.67,15 17,14.33 17,13.5C17,12.67 17.67,12 18.5,12M12,14C13.33,14 18,14.67 18,16V18H6V16C6,14.67 10.67,14 12,14Z" />
          </svg>
          <span class="nav-text">Organizations</span>
        </RouterLink>

        <!-- ✅ NUEVO: Jobs Link (solo para admins del sistema) -->
        <RouterLink
          v-if="authStore.isAdmin"
          to="/admin/jobs"
          class="nav-item"
          active-class="active"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" class="nav-icon">
            <path d="M10,2H14A2,2 0 0,1 16,4V6H20A2,2 0 0,1 22,8V19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19V8A2,2 0 0,1 4,6H8V4A2,2 0 0,1 10,2M14,6V4H10V6H14Z" />
          </svg>
          <span class="nav-text">Jobs</span>
        </RouterLink>
      </div>

      <!-- Organization Members -->
      <div
        v-if="authStore.isOrgMemberUser"
        class="nav-section"
      >
        <div class="section-label">My Organization</div>
        <RouterLink to="/admin/organizations" class="nav-item" active-class="active">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" class="nav-icon">
            <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,12C6.33,12 7,12.67 7,13.5C7,14.33 6.33,15 5.5,15C4.67,15 4,14.33 4,13.5C4,12.67 4.67,12 5.5,12M18.5,12C19.33,12 20,12.67 20,13.5C20,14.33 19.33,15 18.5,15C17.67,15 17,14.33 17,13.5C17,12.67 17.67,12 18.5,12M12,14C13.33,14 18,14.67 18,16V18H6V16C6,14.67 10.67,14 12,14Z" />
          </svg>
          <span class="nav-text">My Organization</span>
        </RouterLink>
        <RouterLink to="/admin/jobs" class="nav-item" active-class="active">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" class="nav-icon">
            <path d="M10,2H14A2,2 0 0,1 16,4V6H20A2,2 0 0,1 22,8V19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19V8A2,2 0 0,1 4,6H8V4A2,2 0 0,1 10,2M14,6V4H10V6H14Z" />
          </svg>
          <span class="nav-text">My Jobs</span>
        </RouterLink>
      </div>

      <!-- Staff -->
      <div
        v-if="authStore.user?.userType === 'staff-user' && authStore.user?.isVerified"
        class="nav-section"
      >
        <div class="section-label">Staff</div>
        <RouterLink to="/admin/staff/events" class="nav-item" active-class="active">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" class="nav-icon">
            <path
              d="M12,2C8.13,2 5,5.13 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9C19,5.13 15.87,2 12,2M12,11.5C10.62,11.5 9.5,10.38 9.5,9C9.5,7.62 10.62,6.5 12,6.5C13.38,6.5 14.5,7.62 14.5,9C14.5,10.38 13.38,11.5 12,11.5Z"
            />
          </svg>
          <span class="nav-text">My Events</span>
        </RouterLink>
      </div>
    </nav>

    <div class="sidebar-footer">
      <div class="user-profile">
        <div class="user-avatar">
          <div class="avatar-circle">{{ userInitial }}</div>
        </div>
        <div class="user-info">
          <span class="user-name">{{ userName }}</span>
          <span class="user-role">{{ authStore.user?.userType }}</span>
        </div>
      </div>

      <button class="logout-btn" @click="handleLogout">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"
          />
        </svg>
        <span>Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()

const userName = computed(() => authStore.userName)
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())

const handleLogout = () => {
  authStore.logout()
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 100;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.3);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.sidebar-header {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(13, 41, 84, 0.3);
  backdrop-filter: blur(10px);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease;
}

.logo-container:hover {
  transform: translateX(2px);
}

.logo-image {
  width: 48px;
  height: auto;
  filter: drop-shadow(0 4px 8px rgba(219, 176, 103, 0.3));
  transition: filter 0.3s ease;
}

.logo-container:hover .logo-image {
  filter: drop-shadow(0 4px 12px rgba(219, 176, 103, 0.5));
}

.logo-text-wrapper {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff 0%, #dbb067 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: 0.05em;
}

.logo-subtitle {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-weight: 500;
}

.navigation {
  flex: 1;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow-y: auto;
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  padding: 0 1.25rem;
  margin-bottom: 0.25rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1.25rem;
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  font-size: 0.95rem;
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background: linear-gradient(180deg, #dbb067 0%, #c9a055 100%);
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.nav-item:hover {
  background: rgba(219, 176, 103, 0.12);
  color: #dbb067;
  transform: translateX(4px);
}

.nav-item:hover::before {
  transform: scaleY(1);
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(219, 176, 103, 0.2) 0%, rgba(219, 176, 103, 0.1) 100%);
  color: #dbb067;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(219, 176, 103, 0.15);
}

.nav-item.active::before {
  transform: scaleY(1);
}

.nav-icon {
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.nav-item:hover .nav-icon {
  transform: scale(1.1);
}

.nav-text {
  flex: 1;
  letter-spacing: 0.01em;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(13, 41, 84, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.user-profile:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(219, 176, 103, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.user-avatar {
  position: relative;
  flex-shrink: 0;
}

.avatar-circle {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #dbb067 0%, #c9a055 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #0f172a;
  font-size: 1.1rem;
  box-shadow: 0 4px 12px rgba(219, 176, 103, 0.3);
  transition: transform 0.3s ease;
}

.user-profile:hover .avatar-circle {
  transform: scale(1.05);
}

.user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
  gap: 0.25rem;
}

.user-name {
  font-weight: 600;
  font-size: 0.95rem;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: capitalize;
  letter-spacing: 0.01em;
}

.user-role {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: capitalize;
  font-weight: 500;
  letter-spacing: 0.05em;
}

.logout-btn {
  width: 100%;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  padding: 0.875rem 1rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.4);
  color: #f87171;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.logout-btn:active {
  transform: translateY(0);
}

/* Scrollbar personalizado */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(219, 176, 103, 0.3);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(219, 176, 103, 0.5);
}

@media (max-width: 1024px) {
  .sidebar {
    width: 260px;
  }

  .logo-image {
    width: 42px;
  }

  .logo-title {
    font-size: 1.3rem;
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
