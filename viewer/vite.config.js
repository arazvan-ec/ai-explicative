import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/ai-explicative/',
  plugins: [react()],
  publicDir: 'public',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  // Servir archivos del ai-logger/data durante desarrollo
  server: {
    fs: {
      allow: ['..'],
    },
  },
})
