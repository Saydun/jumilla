import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: './',
  publicDir: 'assets',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,    // no inlinear assets, siempre archivos
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
});