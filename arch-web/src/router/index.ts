// arch-web/src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

import LoginView from '@/views/LoginView.vue'
import AdminLayout from '@/components/layouts/AdminLayout.vue'
import EventsDashboard from '@/views/EventsDashboard.vue'
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
      component: UnauthorizedView, // 👈 Ruta para no autorizados
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAdmin: true }, // 👈 Marca que requiere admin
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
      ],
    },
    {
      path: '/',
      redirect: '/admin',
    },
  ],
})

// 🔐 GUARDIA DE NAVEGACIÓN MEJORADA
router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  const publicPages = ['/login', '/unauthorized']
  const authRequired = !publicPages.includes(to.path)

  // Si no está logueado y requiere autenticación → login
  if (authRequired && !authStore.isLoggedIn) {
    authStore.returnUrl = to.fullPath
    return '/login'
  }

  // 🚨 NUEVO: Si está logueado pero NO es admin y la ruta requiere admin → unauthorized
  if (
    authStore.isLoggedIn &&
    to.matched.some((record) => record.meta.requiresAdmin) &&
    !authStore.isAdmin
  ) {
    return '/unauthorized'
  }
})

export default router
