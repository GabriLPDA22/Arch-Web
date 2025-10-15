// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

import LoginView from '@/views/LoginView.vue'
import AdminLayout from '@/components/layouts/AdminLayout.vue'
import EventsDashboard from '@/views/EventsDashboard.vue'
import UsersDashboard from '@/views/UsersDashboard.vue'
import UnauthorizedView from '../views/UnauthorizedView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: UnauthorizedView,
    },
    {
      path: '/admin',
      component: AdminLayout,
      // ✅ CAMBIO: Ahora solo requiere poder gestionar el panel (admin o mod)
      meta: { requiresPanelAccess: true },
      children: [
        {
          path: '',
          redirect: '/admin/events',
        },
        {
          path: 'events',
          name: 'admin-events',
          component: EventsDashboard,
        },
        {
          path: 'users',
          name: 'admin-users',
          component: UsersDashboard,
          // ✅ CAMBIO: Esta ruta específica requiere ser admin
          meta: { requiresAdmin: true },
        },
      ],
    },
    {
      path: '/',
      redirect: '/admin',
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  const publicPages = ['/login', '/unauthorized']
  const authRequired = !publicPages.includes(to.path)

  // Si no está logueado y la página no es pública, redirigir a login
  if (authRequired && !authStore.isLoggedIn) {
    authStore.returnUrl = to.fullPath
    return '/login'
  }

  // ✅ NUEVA LÓGICA DE AUTORIZACIÓN POR ROLES
  if (authStore.isLoggedIn) {
    // Verificar acceso general al panel de administración
    if (to.matched.some((record) => record.meta.requiresPanelAccess) && !authStore.canManagePanel) {
      return '/unauthorized'
    }

    // Verificar acceso específico a rutas de solo admin
    if (to.matched.some((record) => record.meta.requiresAdmin) && !authStore.isAdmin) {
      return '/unauthorized'
    }
  }
})

export default router
