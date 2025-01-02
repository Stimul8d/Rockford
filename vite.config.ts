import { defineConfig } from 'vite'

export default defineConfig({
  base: '/Rockford/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  }
})