import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: process.env.VITE_BASE_PATH || './',
  root: '.',
  resolve: {
    alias: {
      '@webmcp-adventure/engine': path.resolve(__dirname, '../engine/src'),
      '@webmcp-adventure/game': path.resolve(__dirname, '../game/src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: './dist',
  },
});
