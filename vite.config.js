
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { API_URL } from './src/helper';
console.log(API_URL);

export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: API_URL,
        // target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
