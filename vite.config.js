import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three') && !id.includes('@react-three')) return 'three-core';
          if (id.includes('@react-three')) return 'r3f';
          if (id.includes('postprocessing')) return 'postfx';
        },
      },
    },
  },
})
