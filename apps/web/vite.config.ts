import { TanStackRouterVite } from "@tanstack/router-vite-plugin"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

import tsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), react(), TanStackRouterVite()],

  build: {
    target: "esnext",
  },
  server: {
    port: 4000,
  },
})
