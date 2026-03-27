import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => ({
  base: '/admin/',
  plugins: [react()],
  resolve: {
    alias: {
      '@common': path.resolve(__dirname, 'common/src'),
    },
  },
  server: {
    port: 3002,
    host: '0.0.0.0',
    proxy: {
      '/api/auth': {
        target: 'http://irms-auth:8001',
        changeOrigin: true,
      },
      '/api/user': {
        target: 'http://irms-user:8005',
        changeOrigin: true,
      },
    },
  },
}));
