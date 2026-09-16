import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    watch: {
      // Evita que o watcher (polling, necessário no bind mount do Docker no
      // Windows) varra o .pnpm-store e a .git, que têm dezenas de milhares
      // de arquivos e travam o carregamento no dev server.
      ignored: ['**/.pnpm-store/**', '**/.git/**'],
    },
  },
});
