import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"

import tsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      strategies: "generateSW",
      /**
       * The Sandbox caches all URLs, this enables us to work offline in
       * cases where we don't know what we're loading up. Effectively
       * everything loaded here should be cached and managed by workbox
       */
      workbox: {
        /** Cache normal static assets */
        globPatterns: ["**"],
        runtimeCaching: [
          {
            /**
             * Runtime caching is needed to cache the data for dynamically
             * loaded apps
             *
             * The `cachebaleResponse` config is needed to store cross-origin
             * resources by workbox
             */
            handler: "StaleWhileRevalidate",
            urlPattern: (_options) => true,
            options: {
              cacheName: "app-cache",
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],

  build: {
    target: "esnext",
    emptyOutDir: true,
    outDir: "../server/dist/sandbox",
  },
  server: {
    port: 5000,
  },
})
