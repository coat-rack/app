import replace from "@rollup/plugin-replace"
import react from "@vitejs/plugin-react"
import { resolve } from "path"
import { defineConfig } from "vite"
import { libInjectCss } from "vite-plugin-lib-inject-css"

export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
  ],
  build: {
    lib: {
      name: "sampleapp",
      entry: resolve(__dirname, "src/index.tsx"),
      formats: ["cjs", "es", "iife", "umd"],
    },

    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
})
