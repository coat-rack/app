import { defineConfig } from "tsup"
// direct import since otherwise we need to compile the internal package
import { getTsupEntrypoints } from "../../packages/build-utils"

const { tsupEntry } = getTsupEntrypoints(__dirname)

export default defineConfig({
  format: ["esm", "cjs"],
  dts: true,
  entry: ["./src/styles.css", ...tsupEntry],
  external: ["react", "react-dom"],
})
