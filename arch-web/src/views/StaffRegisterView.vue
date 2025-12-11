<template>
  <div class="register-container">
    <!-- Sección del Formulario -->
    <div class="form-section">
      <div class="form-wrapper">
        <div class="welcome-header">
          <h1 class="welcome-title">Organization Registration</h1>
          <p class="welcome-subtitle">
            Register your organization to start managing events<br />
            at Oxford University
          </p>
        </div>

        <n-form ref="formRef" :model="form" :rules="rules" @submit.prevent="handleSubmit">
          <n-form-item label="Organization Name" path="organizationName" :show-feedback="false">
            <n-input
              v-model:value="form.organizationName"
              placeholder="Enter your organization name"
              size="large"
              :disabled="isLoading"
              class="custom-input"
            />
          </n-form-item>

          <n-form-item label="Email" path="email" :show-feedback="false">
            <n-input
              v-model:value="form.email"
              type="text"
              placeholder="organization@ox.ac.uk"
              size="large"
              :disabled="isLoading"
              :input-props="{ type: 'email', autocomplete: 'email' }"
              class="custom-input"
            />
            <template #feedback>
              <span class="email-hint">Only Oxford University domains (@ox.ac.uk) are allowed</span>
            </template>
          </n-form-item>

          <n-form-item label="Password" path="password" :show-feedback="false">
            <n-input
              v-model:value="form.password"
              type="password"
              placeholder="At least 8 characters"
              size="large"
              :disabled="isLoading"
              show-password-on="click"
              :input-props="{ autocomplete: 'new-password' }"
              class="custom-input"
            />
          </n-form-item>

          <n-button
            type="primary"
            size="large"
            :loading="isLoading"
            :disabled="isLoading"
            attr-type="submit"
            block
            class="submit-btn"
          >
            {{ isLoading ? 'Registering...' : 'Register Organization' }}
          </n-button>
        </n-form>

        <div class="login-link">
          <span>Already have an account?</span>
          <router-link to="/login" class="link">Sign in</router-link>
        </div>
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { NForm, NFormItem, NInput, NButton, useMessage, type FormInst } from 'naive-ui'
import { StaffApi } from '@/services/StaffService'

const router = useRouter()
const message = useMessage()
const formRef = ref<FormInst | null>(null)

const form = reactive({
  organizationName: '',
  email: '',
  password: '',
})

const isLoading = ref(false)

// Validación de email Oxford
const validateOxfordEmail = (_rule: unknown, value: string) => {
  if (!value) {
    return new Error('Email is required')
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    return new Error('Please enter a valid email address')
  }

  // Validar dominio Oxford
  const oxfordDomains = [
    '@ox.ac.uk',
    '@balliol.ox.ac.uk',
    '@brasenose.ox.ac.uk',
    '@chch.ox.ac.uk',
    '@christchurch.ox.ac.uk',
    '@corpus.ox.ac.uk',
    '@exeter.ox.ac.uk',
    '@hertford.ox.ac.uk',
    '@jesus.ox.ac.uk',
    '@keble.ox.ac.uk',
    '@lady-margaret-hall.ox.ac.uk',
    '@lincoln.ox.ac.uk',
    '@magdalen.ox.ac.uk',
    '@merton.ox.ac.uk',
    '@new.ox.ac.uk',
    '@oriel.ox.ac.uk',
    '@pembroke.ox.ac.uk',
    '@queens.ox.ac.uk',
    '@somerville.ox.ac.uk',
    '@st-annes.ox.ac.uk',
    '@st-catherines.ox.ac.uk',
    '@st-edmund-hall.ox.ac.uk',
    '@st-hildas.ox.ac.uk',
    '@st-hughs.ox.ac.uk',
    '@st-johns.ox.ac.uk',
    '@st-peters.ox.ac.uk',
    '@trinity.ox.ac.uk',
    '@univ.ox.ac.uk',
    '@wadham.ox.ac.uk',
    '@worc.ox.ac.uk',
    '@wadham.ox.ac.uk',
  ]

  const isValidDomain = oxfordDomains.some((domain) => value.toLowerCase().endsWith(domain.toLowerCase()))

  if (!isValidDomain) {
    return new Error('Only Oxford organizations allowed')
  }

  return true
}

const rules = {
  organizationName: [
    { required: true, message: 'Organization name is required', trigger: 'blur' },
    { min: 2, message: 'Organization name must be at least 2 characters', trigger: 'blur' },
  ],
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { validator: validateOxfordEmail, trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' },
    { min: 8, message: 'Password must be at least 8 characters', trigger: 'blur' },
    {
      validator: (_rule: unknown, value: string) => {
        if (!value) return true
        const hasLetter = /[a-zA-Z]/.test(value)
        const hasNumber = /[0-9]/.test(value)
        if (!hasLetter || !hasNumber) {
          return new Error('Password must include at least one letter and one number')
        }
        return true
      },
      trigger: 'blur',
    },
  ],
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (errors) => {
    if (!errors) {
      isLoading.value = true

      try {
        await StaffApi.register({
          organizationName: form.organizationName,
          email: form.email,
          password: form.password,
        })

        message.success('Request sent! Wait for Olivia\'s verification email.', {
          duration: 5000,
        })

        // Mostrar modal de éxito
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.'
        message.error(errorMessage, {
          duration: 5000,
        })
      } finally {
        isLoading.value = false
      }
    }
  })
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.register-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

/* ===== FORM SECTION ===== */
.form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  background: transparent;
}

.form-wrapper {
  width: 100%;
  max-width: 480px;
}

.welcome-header {
  margin-bottom: 2.5rem;
}

.welcome-title {
  font-size: 1.875rem;
  font-weight: 700;
  background: linear-gradient(135deg, #0d2954 0%, #1a3d6e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.75rem;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.welcome-subtitle {
  font-size: 0.9375rem;
  color: #64748b;
  line-height: 1.6;
  font-weight: 400;
}

/* ===== FORM STYLES ===== */
:deep(.n-form-item) {
  margin-bottom: 1.5rem;
}

:deep(.n-form-item-label) {
  font-weight: 500;
  color: #475569;
  font-size: 0.875rem;
}

:deep(.n-input) {
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.n-input:focus-within) {
  border-color: rgba(13, 41, 84, 0.6);
  box-shadow: 0 0 0 3px rgba(13, 41, 84, 0.08);
}

:deep(.n-input__input-el) {
  font-size: 0.9375rem;
}

:deep(.n-input__input-el::placeholder) {
  color: #94a3b8;
}

.email-hint {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 0.25rem;
}

/* Botón personalizado con colores del proyecto */
.submit-btn {
  margin-top: 0.5rem;
  height: 48px;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 10px;
  background: linear-gradient(135deg, #0d2954 0%, #1a3d6e 100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(13, 41, 84, 0.15);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(13, 41, 84, 0.25);
  background: linear-gradient(135deg, #1a3d6e 0%, #0d2954 100%);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(13, 41, 84, 0.2);
}

.login-link {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: #64748b;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.login-link .link {
  color: #0d2954;
  text-decoration: none;
  font-weight: 600;
  margin-left: 0.5rem;
  transition: color 0.2s ease;
}

.login-link .link:hover {
  color: #1a3d6e;
  text-decoration: underline;
}

/* ===== VISUAL SECTION (Desktop Only) ===== */
.visual-section {
  display: none;
}

/* ===== RESPONSIVE DESKTOP ===== */
@media (min-width: 768px) {
  .register-container {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  }

  .form-section {
    flex: 0 0 50%;
    width: 50%;
    background: transparent;
    padding: 3rem;
  }

  .welcome-title {
    font-size: 2.25rem;
  }

  .welcome-subtitle {
    font-size: 1rem;
  }

  .visual-section {
    display: flex;
    flex: 0 0 50%;
    width: 50%;
    background: linear-gradient(135deg, #000000 0%, #0f172a 100%);
    align-items: center;
    justify-content: center;
    padding: 3rem;
    position: relative;
    overflow: hidden;
  }

  .visual-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 50%, rgba(219, 176, 103, 0.1) 0%, transparent 50%);
    pointer-events: none;
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
    transition: filter 0.3s ease;
  }

  .logo-text {
    width: 260px;
    height: auto;
    filter: drop-shadow(0 4px 24px rgba(255, 255, 255, 0.2));
  }

  .tagline {
    margin-top: 2rem;
    font-size: 1.125rem;
    color: rgba(255, 255, 255, 0.75);
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
    max-width: 520px;
  }

  .welcome-title {
    font-size: 2.5rem;
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

  .submit-btn {
    transition: none;
  }
}
</style>

