<template>
  <header class="modern-header">
    <div class="header-background"></div>

    <!-- Main Header Content -->
    <div class="header-content">
      <!-- Left Section -->
      <div class="header-left">
        <div class="header-title">
          <h1 class="title-text">
            <span class="title-main">ARCH</span>
            <span class="title-sub">Admin</span>
          </h1>
          <p class="subtitle">Event Management System</p>
        </div>
      </div>

      <!-- Center Section - Quick Stats -->
      <div class="header-center">
        <div class="quick-stats">
          <div class="quick-stat">
            <MaterialIcons name="event" :size="20" />
            <div class="stat-info">
              <span class="stat-value">{{ totalEvents }}</span>
              <span class="stat-label">Events</span>
            </div>
          </div>
          <div class="quick-stat">
            <MaterialIcons name="people" :size="20" />
            <div class="stat-info">
              <span class="stat-value">{{ totalUsers }}</span>
              <span class="stat-label">Users</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Section -->
      <div class="header-right">
        <!-- Status Indicators -->
        <div class="status-indicators">
          <div class="status-indicator online" title="System Online">
            <div class="status-dot"></div>
            <span>Online</span>
          </div>
        </div>

        <!-- User Profile Section -->
        <div class="user-section">
          <div class="user-profile-header">
            <div class="user-avatar-container">
              <img
                src="/api/placeholder/36/36"
                :alt="userName"
                class="user-avatar"
              />
              <div class="user-status-indicator"></div>
            </div>
            <div class="user-details">
              <span class="user-greeting">Welcome back,</span>
              <span class="user-name">{{ userName }}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="header-actions">
            <button
              class="action-button notification-btn"
              title="Notifications"
              @click="toggleNotifications"
            >
              <MaterialIcons name="notifications" :size="20" />
              <span v-if="notificationCount > 0" class="notification-count">{{ notificationCount }}</span>
            </button>

            <button
              class="action-button settings-btn"
              title="Settings"
              @click="openSettings"
            >
              <MaterialIcons name="settings" :size="20" />
            </button>

            <button
              class="action-button logout-btn"
              title="Logout"
              @click="handleLogout"
            >
              <MaterialIcons name="logout" :size="20" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Dropdown -->
    <transition name="dropdown">
      <div v-if="showNotifications" class="notification-dropdown" @click.stop>
        <div class="notification-header">
          <h3>Notifications</h3>
          <button @click="markAllAsRead" class="mark-read-btn">Mark all read</button>
        </div>
        <div class="notification-list">
          <div v-for="notification in notifications" :key="notification.id" class="notification-item">
            <div class="notification-icon">
              <MaterialIcons :name="notification.icon" :size="16" />
            </div>
            <div class="notification-content">
              <p class="notification-text">{{ notification.message }}</p>
              <span class="notification-time">{{ formatTime(notification.timestamp) }}</span>
            </div>
            <div v-if="!notification.read" class="notification-dot"></div>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import MaterialIcons from '@/components/MaterialIcons.vue';

const authStore = useAuthStore();

// State
const showNotifications = ref(false);
const totalEvents = ref(12);
const totalUsers = ref(1248);
const notificationCount = ref(3);

// Mock notifications data
const notifications = ref([
  {
    id: 1,
    icon: 'event',
    message: 'New event "Summer Festival 2025" has been created',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
    read: false
  },
  {
    id: 2,
    icon: 'people',
    message: '25 new users registered in the last hour',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
    read: false
  },
  {
    id: 3,
    icon: 'analytics',
    message: 'Weekly analytics report is ready',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: true
  }
]);

// Computed
const userName = computed(() => authStore.user?.name || 'Administrator');

// Methods
const handleLogout = () => {
  authStore.logout();
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const openSettings = () => {
  // Navigate to settings or emit event
  console.log('Open settings');
};

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true);
  notificationCount.value = 0;
};

const formatTime = (timestamp: Date) => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();

  if (diff < 60 * 1000) return 'Just now';
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}m ago`;
  if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))}h ago`;

  return timestamp.toLocaleDateString();
};

const handleClickOutside = (event: Event) => {
  if (!event.target) return;
  const target = event.target as Element;
  if (!target.closest('.notification-dropdown') && !target.closest('.notification-btn')) {
    showNotifications.value = false;
  }
};

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.modern-header {
  position: relative;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  overflow: hidden;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 50%, rgba(245, 158, 11, 0.1) 100%);
  z-index: 0;
}

.header-content {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 1.5rem 2rem;
  gap: 2rem;
  z-index: 1;
}

/* Left Section */
.header-left {
  display: flex;
  align-items: center;
}

.header-title {
  display: flex;
  flex-direction: column;
}

.title-text {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin: 0;
  font-weight: 800;
  line-height: 1;
}

.title-main {
  font-size: 2rem;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-sub {
  font-size: 1.25rem;
  color: #f59e0b;
  font-weight: 600;
}

.subtitle {
  color: #94a3b8;
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
  font-weight: 400;
}

/* Center Section */
.header-center {
  display: flex;
  justify-content: center;
}

.quick-stats {
  display: flex;
  gap: 2rem;
}

.quick-stat {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.75rem 1.25rem;
  border-radius: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.quick-stat:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.quick-stat svg {
  color: #6366f1;
}

.stat-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.125rem;
}

.stat-value {
  font-weight: 700;
  font-size: 1.125rem;
  line-height: 1;
}

.stat-label {
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Right Section */
.header-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 2rem;
}

.status-indicators {
  display: flex;
  gap: 1rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-indicator.online {
  color: #10b981;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* User Section */
.user-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-profile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar-container {
  position: relative;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid rgba(99, 102, 241, 0.5);
  object-fit: cover;
}

.user-status-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background: #10b981;
  border: 2px solid rgba(0, 0, 0, 0.4);
  border-radius: 50%;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-greeting {
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 400;
}

.user-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #ffffff;
}

/* Action Buttons */
.header-actions {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  width: 40px;
  height: 40px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.2);
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.4);
  color: #f87171;
}

.notification-count {
  position: absolute;
  top: -6px;
  right: -6px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.125rem 0.375rem;
  border-radius: 1rem;
  min-width: 18px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
}

/* Notification Dropdown */
.notification-dropdown {
  position: absolute;
  top: 100%;
  right: 2rem;
  width: 320px;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  margin-top: 0.5rem;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.notification-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.mark-read-btn {
  background: none;
  border: none;
  color: #6366f1;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  transition: background 0.2s ease;
}

.mark-read-btn:hover {
  background: rgba(99, 102, 241, 0.1);
}

.notification-list {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background 0.2s ease;
}

.notification-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  background: rgba(99, 102, 241, 0.2);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a5b4fc;
}

.notification-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.notification-text {
  color: #e2e8f0;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.4;
}

.notification-time {
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 500;
}

.notification-dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  background: #6366f1;
  border-radius: 50%;
  margin-top: 0.25rem;
}

/* Dropdown Animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top right;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .header-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 1rem;
  }

  .header-center {
    order: -1;
  }

  .quick-stats {
    gap: 1rem;
  }

  .user-section {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .header-content {
    padding: 1rem;
  }

  .title-main {
    font-size: 1.5rem;
  }

  .title-sub {
    font-size: 1rem;
  }

  .quick-stats {
    flex-direction: column;
    gap: 0.5rem;
  }

  .quick-stat {
    padding: 0.5rem 1rem;
  }

  .user-details {
    display: none;
  }

  .notification-dropdown {
    right: 1rem;
    width: calc(100vw - 2rem);
    max-width: 320px;
  }
}

/* Custom Scrollbar */
.notification-list::-webkit-scrollbar {
  width: 4px;
}

.notification-list::-webkit-scrollbar-track {
  background: transparent;
}

.notification-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.notification-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
