import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://script.google.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/submit-form/, '/macros/s/AKfycbxaLSQvHbHmZ7XheTA-HVFMVyh31NrUl7RhMSYnmOCd2jNvAO8UcGGeyhm2hx15FYdcYA/exec'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('Content-Type', 'application/json');
          });
        }
      }
    }
  }
})
