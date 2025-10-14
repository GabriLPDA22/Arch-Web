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
      meta: { requiresAdmin: true },
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
        // ✅ NUEVA RUTA AÑADIDA
        {
          path: 'users',
          name: 'admin-users',
          component: UsersDashboard,
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

  if (authRequired && !authStore.isLoggedIn) {
    authStore.returnUrl = to.fullPath
    return '/login'
  }

  if (
    authStore.isLoggedIn &&
    to.matched.some((record) => record.meta.requiresAdmin) &&
    !authStore.isAdmin
  ) {
    return '/unauthorized'
  }
})

export default router