import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '6584-103-161-144-59.ngrok-free.app',
      '.ngrok-free.app',
      '.ngrok.io'
    ]
  }
})
