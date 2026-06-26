import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',     // new SW activates and reloads automatically
      injectRegister: 'auto',
      manifest: false,                 // we ship our own public/manifest.webmanifest
      includeAssets: ['favicon.svg', 'logo-loader.png'],
      workbox: {
        // Precache only the app shell (code + small assets). Large preview images
        // and the detailed hero emblem are loaded on demand and runtime-cached,
        // so first install stays lean.
        globPatterns: ['**/*.{js,css,html,woff2}', 'favicon.svg', 'logo-loader.png'],
        globIgnores: ['**/og-image.*', '**/*_preview.png', '**/iot_hero.png', '**/digital_olympus.jpg', '**/logo.png'],
        maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
        // Network-first for navigations so users always get fresh HTML
        // (avoids the aggressive-cache problem the old static site had).
        navigateFallbackDenylist: [/^\/api/],
        runtimeCaching: [
          {
            // App pages: try network, fall back to cache when offline
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages',
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
          {
            // Images: cache on first load, serve instantly thereafter
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Google Fonts stylesheets
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          {
            // Google Fonts webfont files
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
      devOptions: {
        enabled: false,  // don't run SW in dev to avoid caching headaches
      },
    }),
  ],

  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },

  build: {
    target: ['es2020', 'chrome80', 'safari13', 'firefox75'],
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'vendor-framer';
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('react-intersection-observer')) return 'vendor-observer';
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) return 'vendor-react';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 500,
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'oxc',
  },
});
