# Arch-Web

<div align="center">

![Vue.js](https://img.shields.io/badge/Vue.js-3.5.18-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.0.6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-3.0.3-FFD859?style=for-the-badge&logo=pinia&logoColor=black)
![Vue Router](https://img.shields.io/badge/Vue_Router-4.5.1-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Naive UI](https://img.shields.io/badge/Naive_UI-2.43.2-18A058?style=for-the-badge&logo=vue.js&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.12.2-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

![Node.js](https://img.shields.io/badge/Node.js-20.19.0+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-9.31.0-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-3.6.2-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)

</div>

---

Sistema web de gestión de eventos y administración de usuarios desarrollado con Vue.js 3 y TypeScript. Plataforma completa para la gestión de eventos, usuarios y personal con sistema de roles y permisos avanzado.

## 📋 Descripción

Arch-Web es una aplicación web moderna diseñada para la gestión integral de eventos y usuarios. El sistema permite a administradores, moderadores y personal verificado gestionar eventos, usuarios y realizar tareas administrativas a través de una interfaz intuitiva y responsiva.

### Características principales

- **Gestión de eventos**: Creación, edición, eliminación y visualización de eventos con información detallada (fechas, ubicación, capacidad, precios, imágenes)
- **Sistema de usuarios**: Administración completa de usuarios con diferentes roles y permisos
- **Sistema de roles**: Control de acceso basado en roles (admin, moderator, staff-user, scanner, user)
- **Verificación de personal**: Panel de administración para verificar y gestionar solicitudes de personal
- **Calendario personalizado**: Visualización de eventos en formato calendario
- **Sistema de preferencias**: Categorización de eventos mediante preferencias/categorías
- **Panel de administración**: Interfaz centralizada para administradores y moderadores
- **Autenticación segura**: Sistema de login con validación de sesión y tokens JWT
- **Exportación de datos**: Capacidad de exportar información a Excel (XLSX)

## 🛠️ Tecnologías Utilizadas

### Frontend Core
- 🟢 **Vue.js 3.5.18** - Framework JavaScript progresivo para construir interfaces de usuario
- 🔵 **TypeScript 5.8** - Superset de JavaScript con tipado estático
- ⚡ **Vite 7.0.6** - Build tool y servidor de desarrollo ultrarrápido

### Gestión de Estado y Routing
- 🍍 **Pinia 3.0.3** - Store de estado oficial para Vue.js
- 🛣️ **Vue Router 4.5.1** - Router oficial para aplicaciones Vue.js

### UI y Estilos
- 🎨 **Naive UI 2.43.2** - Librería de componentes Vue 3 con diseño moderno
- 💨 **Tailwind CSS** - Framework CSS utility-first para diseño responsivo
- 🎯 **@vicons/ionicons5** - Iconos para la interfaz

### Utilidades y Librerías
- 📡 **Axios 1.12.2** - Cliente HTTP para realizar peticiones a la API
- 📊 **XLSX 0.18.5** - Librería para trabajar con archivos Excel
- 📅 **@vuepic/vue-datepicker** - Componente de selección de fechas

### Herramientas de Desarrollo
- ✅ **ESLint** - Linter para mantener calidad de código
- 💅 **Prettier** - Formateador de código
- ⚡ **Oxlint** - Linter rápido y moderno
- 🔍 **Vue TSC** - Type checking para Vue
- 🛠️ **Vite Plugin Vue Devtools** - Herramientas de desarrollo para Vue

## 📁 Estructura del Proyecto

```
arch-web/
├── src/
│   ├── assets/              # Recursos estáticos (imágenes, estilos)
│   ├── components/          # Componentes reutilizables
│   │   ├── admin/          # Componentes de administración
│   │   ├── calendar/       # Componentes de calendario
│   │   ├── common/         # Componentes comunes
│   │   ├── forms/          # Formularios
│   │   ├── layouts/        # Layouts de la aplicación
│   │   └── ui/             # Componentes UI genéricos
│   ├── composables/        # Composables de Vue (lógica reutilizable)
│   ├── router/             # Configuración de rutas
│   ├── services/           # Servicios de API y lógica de negocio
│   ├── stores/             # Stores de Pinia (gestión de estado)
│   ├── utils/              # Utilidades y helpers
│   ├── views/              # Vistas/páginas de la aplicación
│   │   ├── admin/          # Vistas de administración
│   │   └── staff/          # Vistas para personal
│   ├── App.vue             # Componente raíz
│   └── main.ts             # Punto de entrada de la aplicación
├── public/                 # Archivos públicos estáticos
├── dist/                   # Build de producción
└── package.json            # Dependencias y scripts
```

## 🚀 Instalación y Configuración

### Requisitos previos

- **Node.js**: ^20.19.0 || >=22.12.0
- **npm**: Incluido con Node.js

### Pasos de instalación

1. **Clonar el repositorio** (si aplica) o navegar al directorio del proyecto:
   ```bash
   cd arch-web
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   
   Crear un archivo `.env.local` en la raíz del proyecto (`arch-web/`):
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```
   
   Para producción, crear `.env.production`:
   ```env
   VITE_API_BASE_URL=https://api.arch-api.co.uk
   ```

4. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:5173` (o el puerto que Vite asigne).

## 📜 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo con hot-reload
- `npm run build`: Compila el proyecto para producción
- `npm run preview`: Previsualiza el build de producción localmente
- `npm run type-check`: Verifica los tipos de TypeScript
- `npm run lint`: Ejecuta los linters (ESLint y Oxlint)
- `npm run format`: Formatea el código con Prettier

## 🔐 Sistema de Autenticación y Roles

El sistema implementa un control de acceso basado en roles:

- **Admin**: Acceso completo al sistema, gestión de usuarios, eventos y verificación de personal
- **Moderator**: Acceso al panel de administración para gestionar eventos
- **Staff-user**: Personal verificado que puede gestionar sus propios eventos
- **Scanner**: Usuario con permisos de escaneo
- **User**: Usuario estándar

### Flujo de autenticación

1. Los usuarios se autentican mediante email y contraseña
2. El sistema valida las credenciales y asigna un token JWT
3. El token se almacena en localStorage para mantener la sesión
4. Las peticiones a la API incluyen el token en el header Authorization
5. El sistema valida la sesión periódicamente

## 🌐 API y Backend

La aplicación se comunica con un backend REST API. Todas las peticiones se realizan a través del servicio `Api.ts` que centraliza:

- **Autenticación**: Login, registro, verificación de sesión
- **Usuarios**: CRUD completo de usuarios, listado paginado, búsqueda
- **Eventos**: CRUD completo de eventos, listado con filtros, gestión de imágenes
- **Preferencias**: Gestión de categorías/preferencias de eventos
- **Archivos**: Subida de imágenes para eventos

## 🎨 Características de UI/UX

- **Diseño responsivo**: Adaptado para dispositivos móviles, tablets y desktop
- **Componentes modernos**: Utilizando Naive UI para una experiencia de usuario consistente
- **Notificaciones**: Sistema de toasts para feedback al usuario
- **Modales**: Componentes modales para confirmaciones y formularios
- **Paginación**: Navegación eficiente en listados grandes
- **Calendario personalizado**: Visualización intuitiva de eventos

## 📦 Build de Producción

Para generar el build de producción:

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`, listos para ser desplegados en cualquier servidor web estático (Apache, Nginx, Netlify, Vercel, etc.).

Ver el archivo `PRODUCCION.md` para más detalles sobre el despliegue.

## 🔧 Configuración de Desarrollo

### TypeScript

El proyecto utiliza TypeScript con configuración estricta. Los archivos de configuración están en:
- `tsconfig.json`: Configuración base
- `tsconfig.app.json`: Configuración para la aplicación
- `tsconfig.node.json`: Configuración para Node.js

### Linting y Formateo

- **ESLint**: Configurado con plugins para Vue y TypeScript
- **Prettier**: Formateo automático de código
- **Oxlint**: Linter rápido adicional

## 📝 Notas Importantes

- Las variables de entorno deben comenzar con `VITE_` para ser accesibles en el código del cliente
- El archivo `.env.local` está en `.gitignore` por seguridad
- El sistema requiere que el backend API esté disponible y accesible
- Los tokens de autenticación se almacenan en localStorage

## 👥 Contribución

Este es un proyecto privado. Para contribuciones o sugerencias, contactar con el equipo de desarrollo.

## 📄 Licencia

Proyecto privado - Todos los derechos reservados.

---

**Desarrollado con ❤️ usando Vue.js 3 y TypeScript**