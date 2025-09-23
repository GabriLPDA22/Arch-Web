// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5011/api",
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Authentication Configuration
export const AUTH_CONFIG = {
  TOKEN_KEY: import.meta.env.VITE_AUTH_TOKEN_KEY || "arch_access_token",
  REFRESH_TOKEN_KEY:
    import.meta.env.VITE_AUTH_REFRESH_TOKEN_KEY || "arch_refresh_token",
  USER_DATA_KEY: import.meta.env.VITE_AUTH_USER_DATA_KEY || "arch_user_data",
  TOKEN_EXPIRY_MARGIN: 5 * 60 * 1000, // 5 minutos en ms
};

// User Types y Roles
export const USER_TYPES = {
  ADMIN: "admin",
  USER: "user",
  STUDENT: "student",
  ALUMNI: "alumni",
  ORGANISATION: "organisation",
};

export const USER_TYPE_LABELS = {
  [USER_TYPES.ADMIN]: "Administrador",
  [USER_TYPES.USER]: "Usuario",
  [USER_TYPES.STUDENT]: "Estudiante",
  [USER_TYPES.ALUMNI]: "Alumni",
  [USER_TYPES.ORGANISATION]: "Organización",
};

// Event Status
export const EVENT_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
};

export const EVENT_STATUS_LABELS = {
  [EVENT_STATUS.DRAFT]: "Borrador",
  [EVENT_STATUS.PUBLISHED]: "Publicado",
  [EVENT_STATUS.CANCELLED]: "Cancelado",
  [EVENT_STATUS.COMPLETED]: "Completado",
};

export const EVENT_STATUS_COLORS = {
  [EVENT_STATUS.DRAFT]: "gray",
  [EVENT_STATUS.PUBLISHED]: "green",
  [EVENT_STATUS.CANCELLED]: "red",
  [EVENT_STATUS.COMPLETED]: "blue",
};

// User Event Status
export const USER_EVENT_STATUS = {
  REGISTERED: "registered",
  SAVED: "saved",
  PURCHASED: "purchased",
  ATTENDED: "attended",
  CANCELLED: "cancelled",
};

export const USER_EVENT_STATUS_LABELS = {
  [USER_EVENT_STATUS.REGISTERED]: "Registrado",
  [USER_EVENT_STATUS.SAVED]: "Guardado",
  [USER_EVENT_STATUS.PURCHASED]: "Comprado",
  [USER_EVENT_STATUS.ATTENDED]: "Asistió",
  [USER_EVENT_STATUS.CANCELLED]: "Cancelado",
};

// File Upload Configuration
export const FILE_CONFIG = {
  MAX_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB por defecto
  ALLOWED_IMAGE_TYPES: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ],
  ALLOWED_DOCUMENT_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

// Pagination Configuration
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE) || 50,
  MAX_PAGE_SIZE: parseInt(import.meta.env.VITE_MAX_PAGE_SIZE) || 1000,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100, 500],
};

// Oxford Brand Colors
export const OXFORD_COLORS = {
  PRIMARY: import.meta.env.VITE_OXFORD_PRIMARY || "#003366",
  LIGHT: import.meta.env.VITE_OXFORD_LIGHT || "#1a4d73",
  DARK: import.meta.env.VITE_OXFORD_DARK || "#002244",
  GOLD: import.meta.env.VITE_GOLD_PRIMARY || "#ffd700",
  GOLD_DARK: import.meta.env.VITE_GOLD_DARK || "#ccaa00",
};

// Date and Time Formats
export const DATE_FORMATS = {
  SHORT: "dd/MM/yyyy",
  LONG: "dd/MM/yyyy HH:mm",
  FULL: "EEEE, dd 'de' MMMM 'de' yyyy",
  ISO: "yyyy-MM-dd",
  TIME_ONLY: "HH:mm",
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  OXFORD_EMAIL_REGEX: /@(.*\.)?ox\.ac\.uk$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  POSTCODE_UK_REGEX: /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i,
};

// Toast Notification Types
export const TOAST_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

// Default Toast Messages
export const DEFAULT_MESSAGES = {
  LOADING: "Cargando...",
  SAVING: "Guardando...",
  DELETING: "Eliminando...",
  SUCCESS_SAVE: "Guardado correctamente",
  SUCCESS_DELETE: "Eliminado correctamente",
  SUCCESS_UPDATE: "Actualizado correctamente",
  ERROR_GENERIC: "Ha ocurrido un error. Por favor, inténtalo de nuevo.",
  ERROR_NETWORK: "Error de conexión. Verifica tu conexión a internet.",
  ERROR_UNAUTHORIZED: "No tienes permisos para realizar esta acción.",
  ERROR_VALIDATION: "Por favor, verifica los datos ingresados.",
  CONFIRM_DELETE: "¿Estás seguro de que deseas eliminar este elemento?",
  CONFIRM_BULK_DELETE:
    "¿Estás seguro de que deseas eliminar los elementos seleccionados?",
};

// Chart Configuration
export const CHART_CONFIG = {
  DEFAULT_COLORS: [
    OXFORD_COLORS.PRIMARY,
    OXFORD_COLORS.GOLD,
    OXFORD_COLORS.LIGHT,
    "#10B981", // Green
    "#F59E0B", // Yellow
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#06B6D4", // Cyan
  ],
  ANIMATION_DURATION: 300,
  RESPONSIVE: true,
  MAINTAIN_ASPECT_RATIO: false,
};

// Navigation Menu Items
export const NAVIGATION_ITEMS = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "ChartBarIcon",
    requiresAdmin: true,
  },
  {
    name: "Usuarios",
    href: "/users",
    icon: "UsersIcon",
    requiresAdmin: true,
    badge: "dynamic", // Se calculará dinámicamente
  },
  {
    name: "Eventos",
    href: "/events",
    icon: "CalendarIcon",
    requiresAdmin: true,
    children: [
      { name: "Todos los eventos", href: "/events" },
      { name: "Eventos activos", href: "/events?filter=active" },
      { name: "Eventos pasados", href: "/events?filter=past" },
    ],
  },
  {
    name: "Cupones",
    href: "/coupons",
    icon: "GiftIcon",
    requiresAdmin: true,
  },
  {
    name: "Preferencias",
    href: "/preferences",
    icon: "CogIcon",
    requiresAdmin: true,
  },
  {
    name: "Registros",
    href: "/user-events",
    icon: "LinkIcon",
    requiresAdmin: true,
  },
  {
    name: "Imágenes",
    href: "/event-images",
    icon: "PhotoIcon",
    requiresAdmin: true,
  },
];

// Table Configuration
export const TABLE_CONFIG = {
  DEFAULT_SORT_ORDER: "asc",
  ITEMS_PER_PAGE_OPTIONS: [10, 25, 50, 100],
  DEFAULT_ITEMS_PER_PAGE: 50,
  MAX_VISIBLE_PAGES: 5,
};

// Form Field Types
export const FORM_FIELD_TYPES = {
  TEXT: "text",
  EMAIL: "email",
  PASSWORD: "password",
  NUMBER: "number",
  DATE: "date",
  DATETIME: "datetime-local",
  TEXTAREA: "textarea",
  SELECT: "select",
  CHECKBOX: "checkbox",
  RADIO: "radio",
  FILE: "file",
  IMAGE: "image",
  CURRENCY: "currency",
  BOOLEAN: "boolean",
};

// Error Codes
export const ERROR_CODES = {
  NETWORK_ERROR: "NETWORK_ERROR",
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  SERVER_ERROR: 500,
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
};

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: "arch_theme",
  LANGUAGE: "arch_language",
  TABLE_PREFERENCES: "arch_table_preferences",
  DASHBOARD_LAYOUT: "arch_dashboard_layout",
  NOTIFICATION_SETTINGS: "arch_notification_settings",
};

// Environment Configuration
export const ENV_CONFIG = {
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
  APP_VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",
  DEBUG_ENABLED: import.meta.env.VITE_DEBUG === "true",
};

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
  ENABLE_ERROR_REPORTING:
    import.meta.env.VITE_ENABLE_ERROR_REPORTING === "true",
  ENABLE_DARK_MODE: import.meta.env.VITE_ENABLE_DARK_MODE === "true",
  ENABLE_TOAST_NOTIFICATIONS:
    import.meta.env.VITE_ENABLE_TOAST_NOTIFICATIONS !== "false",
};

// Export all as default for easy importing
export default {
  API_CONFIG,
  AUTH_CONFIG,
  USER_TYPES,
  USER_TYPE_LABELS,
  EVENT_STATUS,
  EVENT_STATUS_LABELS,
  EVENT_STATUS_COLORS,
  USER_EVENT_STATUS,
  USER_EVENT_STATUS_LABELS,
  FILE_CONFIG,
  PAGINATION_CONFIG,
  OXFORD_COLORS,
  DATE_FORMATS,
  VALIDATION_RULES,
  TOAST_TYPES,
  DEFAULT_MESSAGES,
  CHART_CONFIG,
  NAVIGATION_ITEMS,
  TABLE_CONFIG,
  FORM_FIELD_TYPES,
  ERROR_CODES,
  STORAGE_KEYS,
  ENV_CONFIG,
  FEATURE_FLAGS,
};
