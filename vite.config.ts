import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [glsl(),
  VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'WebGL with TypeScript',
      short_name: 'WebGLTS',
      description: 'A basic WebGL application with TypeScript and Vite',
      theme_color: '#ffffff',
      icons: [
        { src: 'icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: 'icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
  }),
  ],
});
