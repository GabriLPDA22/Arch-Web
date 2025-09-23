// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

// Importamos el NUEVO Layout
import AdminLayout from '@/components/AdminLayout.vue'

// Carga perezosa (Lazy Loading) para las vistas
const LoginView = () => import('@/views/LoginView.vue')
const DashboardView = () => import('@/views/DashboardView.vue')
const UnauthorizedView = () => import('@/views/Unauthorized.vue')
const NotFoundView = () => import('@/views/NotFound.vue')

// Tipado de meta
declare module 'vue-router' {
  interface RouteMeta {
    title: string
    requiresAuth?: boolean
    requiresAdmin?: boolean
  }
}

// --- NUEVA ESTRUCTURA DE RUTAS ---
const routes: RouteRecordRaw[] = [
  // Rutas públicas que no usan el Layout
  {
    path: '/',
    redirect: { name: 'login' } // Redirige la raíz a /login
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { title: 'Login' }
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: UnauthorizedView,
    meta: { title: 'No Autorizado' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notfound',
    component: NotFoundView,
    meta: { title: '404' }
  },

  // Ruta "Padre" de Administración que carga el Layout
  {
    path: '/admin',
    component: AdminLayout, // Carga el Layout que creamos
    meta: {
      title: 'Admin',
      requiresAuth: true,
      requiresAdmin: true
    },
    // Rutas "Hijas" que se renderizan DENTRO del AdminLayout
    children: [
      {
        path: '', // Coincide con /admin
        name: 'dashboard',
        component: DashboardView, // La página de bienvenida
        meta: { title: 'Dashboard' }
      },
      // {
      //   path: 'users', // Coincidiría con /admin/users
      //   name: 'admin-users',
      //   component: () => import('@/views/UsersView.vue'), // Ejemplo
      //   meta: { title: 'Usuarios' }
      // }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// El guardián global no cambia
router.beforeEach((to, _from, next) => {
  document.title = `${to.meta.title} | Mi Dashboard`

  const authStore = useAuthStore()

  if (to.meta.requiresAuth) {
    if (!authStore.isLoggedIn) {
      authStore.returnUrl = to.fullPath
      return next({ name: 'login' })
    }
    if (to.meta.requiresAdmin && !authStore.isAdmin) {
      return next({ name: 'unauthorized' })
    }
  }
  next()
})

export default router
