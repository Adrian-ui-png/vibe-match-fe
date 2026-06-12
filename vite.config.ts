import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://vibe-match-api-60fd.onrender.com',
        changeOrigin: true,
      }
    },
    allowedHosts: [
      'vibe-match-api-60fd.onrender.com',
      '.onrender.com',
    ]
  }
})
