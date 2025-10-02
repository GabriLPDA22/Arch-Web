<!-- arch-web/src/views/UnauthorizedView.vue -->
<template>
    <div class="unauthorized-container">
      <div class="unauthorized-card">
        <!-- Icono animado -->
        <div class="icon-wrapper">
          <svg class="shield-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L4 5V11C4 16.55 7.84 21.74 12 23C16.16 21.74 20 16.55 20 11V5L12 2Z" 
                  stroke="currentColor" 
                  stroke-width="2" 
                  stroke-linecap="round" 
                  stroke-linejoin="round"/>
            <path d="M9 12L11 14L15 10" 
                  stroke="currentColor" 
                  stroke-width="2" 
                  stroke-linecap="round" 
                  stroke-linejoin="round"/>
          </svg>
        </div>
  
        <!-- Mensaje principal -->
        <h1 class="title">Access Restricted</h1>
        <p class="message">
          Sorry, you do not have administrator permissions to access this section.
        </p>
        <p class="submessage">
          If you believe you should have access, please contact your system administrator.
        </p>
  
        <!-- Botones de acción -->
        <div class="actions">
          <button @click="goToLogin" class="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10,17V14H3V10H10V7L15,12L10,17M10,2H19A2,2 0 0,1 21,4V20A2,2 0 0,1 19,22H10A2,2 0 0,1 8,20V18H10V20H19V4H10V6H8V4A2,2 0 0,1 10,2Z"/>
            </svg>
            Back to sign in
          </button>
          
          <button @click="logout" class="btn btn-secondary">
            Sign out
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth.store';
  
  const router = useRouter();
  const authStore = useAuthStore();
  
  const goToLogin = () => {
    router.push('/login');
  };
  
  const logout = async () => {
    await authStore.logout();
  };
  </script>
  
  <style scoped>
  .unauthorized-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0d2954 0%, #1a3a6b 100%);
    padding: 1.5rem;
  }
  
  .unauthorized-card {
    background: white;
    border-radius: 24px;
    padding: 3rem 2.5rem;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    text-align: center;
    animation: slideUp 0.5s ease-out;
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .icon-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 96px;
    height: 96px;
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    border-radius: 50%;
    margin-bottom: 2rem;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
  
  .shield-icon {
    width: 48px;
    height: 48px;
    color: #dc2626;
  }
  
  .title {
    font-size: 2rem;
    font-weight: 700;
    color: #0d2954;
    margin: 0 0 1rem 0;
    letter-spacing: -0.02em;
  }
  
  .message {
    font-size: 1.125rem;
    color: #475569;
    line-height: 1.6;
    margin: 0 0 1rem 0;
  }
  
  .submessage {
    font-size: 0.938rem;
    color: #94a3b8;
    line-height: 1.5;
    margin: 0 0 2.5rem 0;
  }
  
  .actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.625rem;
    padding: 1rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .btn:active {
    transform: scale(0.98);
  }
  
  .btn-primary {
    background: #0d2954;
    color: white;
  }
  
  .btn-primary:hover {
    background: #1a3a6b;
    box-shadow: 0 4px 12px rgba(13, 41, 84, 0.3);
  }
  
  .btn-secondary {
    background: #f1f5f9;
    color: #64748b;
  }
  
  .btn-secondary:hover {
    background: #e2e8f0;
  }
  
  @media (max-width: 640px) {
    .unauthorized-card {
      padding: 2.5rem 1.75rem;
    }
  
    .title {
      font-size: 1.75rem;
    }
  
    .icon-wrapper {
      width: 80px;
      height: 80px;
    }
  
    .shield-icon {
      width: 40px;
      height: 40px;
    }
  }
  </style>