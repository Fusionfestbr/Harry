import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Configuração para Multi-Page Application (MPA)
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ingresso: resolve(__dirname, 'ingresso.html'),
      },
      output: {
        // Remove o hash dos arquivos para não quebrar seu Service Worker manual
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`
      }
    },
    assetsDir: 'build-assets',
  },
  server: {
    open: true,
  },
});
