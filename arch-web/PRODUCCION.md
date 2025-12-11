# 🚀 Guía para Ejecutar en Producción

## Pasos para ejecutar el proyecto en modo producción

### 1. Crear archivo de configuración de producción

Crea un archivo `.env.production` en la raíz del proyecto (`arch-web/`) con el siguiente contenido:

```env
VITE_API_BASE_URL=https://api.arch-api.co.uk
```

### 2. Compilar el proyecto

Ejecuta el siguiente comando para crear el build de producción:

```bash
npm run build
```

Esto generará los archivos optimizados en la carpeta `dist/`.

### 3. Opciones para servir el proyecto

#### Opción A: Usar Vite Preview (para pruebas locales)

```bash
npm run preview
```

Esto iniciará un servidor local que sirve los archivos de producción. Útil para probar antes de desplegar.

#### Opción B: Servir con un servidor web (Apache/Nginx)

Los archivos en `dist/` están listos para ser desplegados en cualquier servidor web:

- **Apache**: Copia el contenido de `dist/` a tu directorio web (ej: `/var/www/html/`)
- **Nginx**: Configura el root apuntando a la carpeta `dist/`
- **Netlify/Vercel**: Conecta tu repositorio y apunta al directorio `dist/`

### 4. Verificar la configuración

Asegúrate de que:
- ✅ El archivo `.env.production` existe y tiene la URL correcta del backend
- ✅ El backend en producción está accesible desde la URL configurada
- ✅ Los archivos en `dist/` se generaron correctamente

## Variables de entorno disponibles

- `VITE_API_BASE_URL`: URL base del backend API (requerida)

## Notas importantes

- El archivo `.env.production` solo se usa cuando ejecutas `npm run build`
- Para desarrollo local, usa `.env.local` con `VITE_API_BASE_URL=http://localhost:5000`
- Los archivos `.env*` están en `.gitignore` por seguridad

