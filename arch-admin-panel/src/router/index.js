import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

// Lazy loading de componentes principales
const LoginView = () => import("@/views/auth/LoginView.vue");
const DashboardView = () => import("@/views/dashboard/DashboardView.vue");

const routes = [
  // Redirección raíz
  {
    path: "/",
    redirect: "/dashboard",
  },

  // Rutas de autenticación (públicas)
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: {
      requiresAuth: false,
      title: "Iniciar Sesión - ARCH Admin",
    },
  },

  // Rutas protegidas (requieren autenticación de admin)
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardView,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: "Dashboard - ARCH Admin",
    },
  },

  // Ruta 404 - Página no encontrada
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFoundView.vue"),
    meta: {
      title: "Página no encontrada - ARCH Admin",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// Guard global básico para proteger rutas
router.beforeEach(async (to, from, next) => {
  // Actualizar el título de la página
  document.title = to.meta.title || "ARCH Admin Panel";

  // Rutas que no requieren autenticación
  if (!to.meta.requiresAuth) {
    return next();
  }

  // Para rutas protegidas, por ahora solo redirigimos al login
  // TODO: Implementar verificación de autenticación completa
  const token = localStorage.getItem("arch_access_token");
  const userData = localStorage.getItem("arch_user_data");

  if (!token || !userData) {
    return next({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  }

  // Verificar que el usuario sea admin
  try {
    const user = JSON.parse(userData);
    if (to.meta.requiresAdmin && user.userType !== "admin") {
      return next({
        path: "/login",
        query: {
          redirect: to.fullPath,
          error: "access_denied",
        },
      });
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
    return next("/login");
  }

  next();
});

export default router;
