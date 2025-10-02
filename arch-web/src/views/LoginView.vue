<!-- Ruta: arch-web/src/views/LoginView.vue -->
<template>
  <div class="login-container">
    <!-- Sección del Formulario -->
    <div class="form-section">
      <div class="form-wrapper">
        <div class="welcome-header">
          <h1 class="welcome-title">Welcome Back 👋</h1>
          <p class="welcome-subtitle">
            Today is a new day. It's your day. You shape it.<br />
            Sign in to start managing your events.
          </p>
        </div>

        <form class="login-form" @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email" class="form-label">E-mail</label>
            <input
              type="email"
              id="email"
              v-model="email"
              class="form-input"
              placeholder="example@email.com"
              required
              autocomplete="email"
              :disabled="isLoading"
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <div class="password-wrapper">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                class="form-input"
                placeholder="At least 8 characters"
                required
                autocomplete="current-password"
                :disabled="isLoading"
              />
              <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                <svg
                  v-if="!showPassword"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg
                  v-else
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                  ></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>
          </div>

          <button type="submit" class="submit-btn" :disabled="isLoading">
            {{ isLoading ? 'Signing in...' : 'Sign in' }}
          </button>

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </form>
      </div>
    </div>

    <!-- Sección Visual - Solo visible en desktop -->
    <div class="visual-section">
      <div class="visual-content">
        <div class="logo-wrapper">
          <img src="../assets/images/ARCH_Logo.svg" alt="ARCH Logo" class="main-logo" />
          <img src="../assets/images/ARCH_Logo_Font.svg" alt="ARCH" class="logo-text" />
        </div>
        <p class="tagline">Events Management Platform</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const authStore = useAuthStore()
const errorMessage = computed(() => authStore.loginError)

const handleLogin = async () => {
  isLoading.value = true
  await authStore.login(email.value, password.value)
  isLoading.value = false
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.login-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: #f9fafb;
}

/* ===== FORM SECTION ===== */
.form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  background: #f9fafb;
}

.form-wrapper {
  width: 100%;
  max-width: 480px;
}

.welcome-header {
  margin-bottom: 2rem;
}

.welcome-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.75rem;
  line-height: 1.2;
}

.welcome-subtitle {
  font-size: 0.9375rem;
  color: #6b7280;
  line-height: 1.6;
}

/* ===== FORM STYLES ===== */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.9375rem;
  font-weight: 400;
  color: #6b7280;
}

.password-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #111827;
  background: #ffffff;
  transition: all 0.2s ease;
  outline: none;
}

.password-wrapper .form-input {
  padding-right: 3rem;
}

.form-input::placeholder {
  color: #9ca3af;
}

.form-input:focus {
  border-color: #0d2954;
  box-shadow: 0 0 0 3px rgba(13, 41, 84, 0.1);
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f3f4f6;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.toggle-password:hover {
  color: #111827;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: #0d2954;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  background: #1a3d6e;
}

.submit-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  padding: 0.875rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.875rem;
  text-align: center;
}

/* ===== VISUAL SECTION (Desktop Only) ===== */
.visual-section {
  display: none;
}

/* ===== RESPONSIVE DESKTOP ===== */
@media (min-width: 768px) {
  .login-container {
    background: #ffffff;
  }

  .form-section {
    flex: 0 0 50%;
    width: 50%;
    background: #ffffff;
    padding: 3rem;
  }

  .welcome-title {
    font-size: 2rem;
  }

  .welcome-subtitle {
    font-size: 1rem;
  }

  .visual-section {
    display: flex;
    flex: 0 0 50%;
    width: 50%;
    background: #000000;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    position: relative;
    overflow: hidden;
  }

  .visual-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }

  .logo-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    animation: float 3s ease-in-out infinite;
  }

  .main-logo {
    width: 200px;
    height: auto;
    filter: drop-shadow(0 8px 32px rgba(219, 176, 103, 0.4));
  }

  .logo-text {
    width: 260px;
    height: auto;
    filter: drop-shadow(0 4px 24px rgba(255, 255, 255, 0.2));
  }

  .tagline {
    margin-top: 2rem;
    font-size: 1.125rem;
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
    font-weight: 300;
    letter-spacing: 0.05em;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
}

@media (min-width: 1024px) {
  .form-section {
    padding: 4rem;
  }

  .form-wrapper {
    max-width: 500px;
  }

  .welcome-title {
    font-size: 2.25rem;
  }

  .main-logo {
    width: 240px;
  }

  .logo-text {
    width: 300px;
  }
}

/* ===== ACCESSIBILITY ===== */
@media (prefers-reduced-motion: reduce) {
  .logo-wrapper {
    animation: none;
  }

  .submit-btn,
  .form-input,
  .toggle-password {
    transition: none;
  }
}
</style>