import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // 👇 Copia el .htaccess automáticamente al build
  publicDir: 'public',
  // 👇 Proxy para evitar CORS en desarrollo
  server: {
    proxy: {
      '/api-dev': {
        target: 'https://api.arch-api.co.uk',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})