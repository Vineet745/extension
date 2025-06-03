import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/manifest.json',
          dest: '.', // Copy manifest.json to build/
        },
      ],
    }),
  ],
  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'),
        // colorPicker: resolve(__dirname, 'src/content/colorPicker.ts'),
        // copyText: resolve(__dirname, 'src/content/copyText.ts'),
        content: resolve(__dirname, 'src/content/content.js'),
      },
      output: {
        entryFileNames: '[name].js', 
      },
    },
    emptyOutDir: true,
  },
});
