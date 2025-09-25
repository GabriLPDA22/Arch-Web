import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

// Importa tus componentes de vista
import LoginView from '@/views/LoginView.vue';
import AdminLayout from '@/components/layouts/AdminLayout.vue';
import EventsDashboard from '@/views/EventsDashboard.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/admin',
      component: AdminLayout, // El layout principal para el panel
      children: [
        // <-- CAMBIO: Redirige /admin a /admin/events
        {
          path: '',
          redirect: '/admin/events',
        },
        // <-- CAMBIO: La ruta ahora es 'events' para que coincida con el enlace
        {
          path: 'events',
          name: 'admin-events', // Nombre actualizado para mayor claridad
          component: EventsDashboard,
        },
      ],
    },
    // Redirige la raíz a la página de login o al dashboard si ya está logueado
    {
      path: '/',
      redirect: '/admin',
    },
  ],
});

// Guardia de Navegación: Protege las rutas de administración
router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);

  // Si se requiere autenticación y el usuario no está logueado,
  // redirige a la página de login.
  if (authRequired && !authStore.isLoggedIn) {
    authStore.returnUrl = to.fullPath;
    return '/login';
  }
});

export default router;
