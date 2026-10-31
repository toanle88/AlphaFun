/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['alphafun-icon.svg', 'alphafun-icon-192.png', 'alphafun-icon-512.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,webp}'],
        maximumFileSizeToCacheInBytes: 512 * 1024,
      },
      manifest: {
        name: 'AlphaFun',
        short_name: 'AlphaFun',
        description: 'Learning is fun!',
        start_url: '/',
        display: 'standalone',
        background_color: '#F8FBFA',
        theme_color: '#FF6B6B',
        icons: [
          {
            src: 'alphafun-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
          {
            src: 'alphafun-icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'alphafun-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    exclude: ['node_modules', 'dist', 'tests/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/test/**', '**/*.test.{ts,tsx}', 'src/main.tsx'],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70,
      },
    },
  },
})
