import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { cloudflare } from "@cloudflare/vite-plugin"

export default defineConfig({
  plugins: [
    react(),
    cloudflare(),
  ],
  build: {
    manifest: 'manifest.json',
    rollupOptions: {
      input: {
        app: '/client/app.ts',
        appInit: '/client/app-init.ts',
        home: '/client/home.ts',
      }
    }
  },
  server: {
    allowedHosts: true,
  },
});
