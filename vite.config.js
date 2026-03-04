import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VITE_API_URL } from './src/helper';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: VITE_API_URL,
        // target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
