// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'ignore-css',
      enforce: 'pre',
      load(id) {
        if (id.endsWith('.css')) return 'export default {};';
      },
    },
  ],
});
