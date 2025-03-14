import replace from "@rollup/plugin-replace"
import react from "@vitejs/plugin-react"
import { resolve } from "path"
import externalGlobals from "rollup-plugin-external-globals"
import { defineConfig } from "vite"
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js"

export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin({
      dev: {
        enableDev: true,
      },
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    // Cannot use build.rollupOptions.output.global with ESM
    externalGlobals({
      react: "React",
      "react-dom": "ReactDOM",
    }),
  ],
  build: {
    lib: {
      name: "budget",
      entry: resolve(__dirname, "src/index.tsx"),
      formats: ["es"],
    },

    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        format: "es",
        exports: "named",
        entryFileNames: "index.mjs",
      },
    },
  },
})
