import { defineConfig } from "tsup"
// direct import since otherwise we need to compile the internal package

export default defineConfig({
  format: ["esm"],
  entry: ["./src/index.ts", "./src/plopfile.ts"],
})
