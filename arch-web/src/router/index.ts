// src/router/index.ts (fragmento)
import { createRouter, createWebHistory } from "vue-router";
import EventsDashboard from "@/views/EventsDashboard.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ...tus otras rutas
    { path: "", component: EventsDashboard, meta: { requiresAuth: true } },
  ],
});

export default router;
