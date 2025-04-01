import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/MoodTickler/', // <-- This line is new
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
