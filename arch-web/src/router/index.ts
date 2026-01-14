// ==============================================
// RUTA: src/router/index.ts
// ACCIÓN: REEMPLAZAR archivo completo
// ==============================================

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

import LoginView from '@/views/LoginView.vue'
import AdminLayout from '@/components/layouts/AdminLayout.vue'
import EventsDashboard from '@/views/EventsDashboard.vue'
import UsersDashboard from '@/views/UsersDashboard.vue'
import StaffRegisterView from '@/views/StaffRegisterView.vue'
import StaffEventsView from '@/views/staff/StaffEventsView.vue'
import StaffVerificationView from '@/views/admin/StaffVerificationView.vue'
import ReportsDashboard from '@/views/admin/ReportsDashboard.vue' // ✅ NUEVO
import OrganizationRouter from '@/views/admin/OrganizationRouter.vue' // ✅ NUEVO - Router component
import JobsRouter from '@/views/admin/JobsRouter.vue' // ✅ NUEVO - Router component
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
      path: '/staff/register',
      name: 'staff-register',
      component: StaffRegisterView,
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: UnauthorizedView,
    },
    {
      path: '/admin',
      component: AdminLayout,
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
          meta: { requiresAdmin: true },
        },
        {
          path: 'staff/verification',
          name: 'staff-verification',
          component: StaffVerificationView,
          meta: { requiresAdmin: true },
        },
        // ✅ NUEVA RUTA - Reports Dashboard
        {
          path: 'reports',
          name: 'admin-reports',
          component: ReportsDashboard,
          meta: { requiresAdmin: true },
        },
        // ✅ NUEVA RUTA - Organizations Dashboard
        // Usa OrganizationRouter que decide qué componente mostrar según el tipo de usuario
        {
          path: 'organizations',
          name: 'admin-organizations',
          component: OrganizationRouter,
          meta: { requiresAdmin: true },
        },
        // ✅ NUEVA RUTA - Jobs Dashboard
        // Usa JobsRouter que decide qué componente mostrar según el tipo de usuario
        {
          path: 'jobs',
          name: 'admin-jobs',
          component: JobsRouter,
          meta: { requiresAdmin: true },
        },
        {
          path: 'staff/events',
          name: 'staff-events',
          component: StaffEventsView,
          meta: { requiresStaff: true },
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
  const publicPages = ['/login', '/unauthorized', '/staff/register']
  const authRequired = !publicPages.includes(to.path)

  // Si no está logueado y la página no es pública, redirigir a login
  if (authRequired && !authStore.isLoggedIn) {
    authStore.returnUrl = to.fullPath
    return '/login'
  }

  // Lógica de autorización por roles
  if (authStore.isLoggedIn) {
    const user = authStore.user
    const isAdmin = user?.userType === 'admin'
    const isModerator = user?.userType === 'moderator'
    const isStaff = user?.userType === 'staff-user'
    const isOrgMemberUser = user?.userType === 'org-members'
    const isVerifiedStaff = isStaff && user?.isVerified === true
    const canManagePanel = isAdmin || isModerator
    const isOrgAdmin = authStore.isOrgAdmin
    const isOrgEditor = authStore.isOrgEditor
    const isOrgMember = authStore.isOrgMember

    // Verificar acceso general al panel de administración
    if (to.matched.some((record) => record.meta.requiresPanelAccess)) {
      if (!canManagePanel && !isVerifiedStaff && !isOrgMemberUser) {
        return '/unauthorized'
      }
    }

    // Verificar acceso específico a rutas de solo admin (sistema)
    // PERO permitir acceso a org-members con rol Admin para organizations y jobs
    if (to.matched.some((record) => record.meta.requiresAdmin)) {
      const isOrganizationsOrJobs = to.path === '/admin/organizations' || to.path === '/admin/jobs' || 
                                     to.name === 'admin-organizations' || to.name === 'admin-jobs'
      
      if (!isAdmin && isOrganizationsOrJobs) {
        // Para organizations y jobs, permitir si es org-members con rol Admin/Editor/Member
        if (!isOrgMemberUser || (!isOrgAdmin && !isOrgEditor && !isOrgMember)) {
          return '/unauthorized'
        }
      } else if (!isAdmin) {
        // Para otras rutas de admin, solo admins del sistema
        return '/unauthorized'
      }
    }

    // Verificar acceso específico a rutas de staff
    if (to.matched.some((record) => record.meta.requiresStaff)) {
      if (!isVerifiedStaff) {
        return '/unauthorized'
      }
    }

    // Nota: La verificación de acceso a organizations y jobs ya se hace arriba
    // en la sección de requiresAdmin, así que no necesitamos duplicar aquí
  }
})

export default router
