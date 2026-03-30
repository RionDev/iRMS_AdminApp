import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBaseUrl = env.VITE_API_BASE_URL?.trim();

  return {
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
      proxy: apiBaseUrl
        ? {
            '/api': {
              target: apiBaseUrl,
              changeOrigin: true,
            },
          }
        : undefined,
    },
  };
});
