import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import Toast from "vue-toastification";

import App from "./App.vue";

// Styles
import "./assets/css/main.css";
import "vue-toastification/dist/index.css";

const app = createApp(App);
const pinia = createPinia();

// Toast configuration
const toastOptions = {
  position: "top-right",
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true,
  filterBeforeCreate: (toast, toasts) => {
    // Evitar toasts duplicados
    if (toasts.filter((t) => t.content === toast.content).length !== 0) {
      return false;
    }
    return toast;
  },
};

// Global error handler
app.config.errorHandler = (error, vm, info) => {
  console.error("Global Vue error:", error, info);

  // En producción, enviar a servicio de error reporting
  if (import.meta.env.PROD) {
    // Ejemplo: Sentry.captureException(error)
  }
};

// Performance monitoring en desarrollo
if (import.meta.env.DEV) {
  app.config.performance = true;
}

app.use(pinia);
app.use(router);
app.use(Toast, toastOptions);

app.mount("#app");
