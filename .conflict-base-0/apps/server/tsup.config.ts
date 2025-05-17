import { defineConfig } from "tsup"

export default defineConfig({
  format: ["cjs"],
  entry: ["src/index.ts"],
  clean: false,
})
