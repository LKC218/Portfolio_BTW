import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/Portfolio_BTW/',
      server: {
        port: Number(env.PORT) || 3000,
        host: '0.0.0.0',
        open: true,
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
              'vendor-gsap': ['gsap', '@gsap/react'],
            }
          }
        }
      }
    };
});
