import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/dcadb1a7a96dae155e42d2c82c47c6d7': {
        target: 'https://www.superheroapi.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api.php')
      }
    }
  }
})