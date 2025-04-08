import { defineConfig } from "tsup"
// direct import since otherwise we need to compile the internal package
import {
  getTsupEntryPoints,
  prefixExportPaths,
  updatePackageJsonExports,
} from "../build-utils"

const { packageJsonExports, tsupEntry } = getTsupEntryPoints(
  __dirname,
  "src/components",
)

const adjustedPackageJsonExports = prefixExportPaths(
  "components",
  packageJsonExports,
)
updatePackageJsonExports(__dirname, {
  "./styles.css": "./dist/styles.css",
  ...adjustedPackageJsonExports,
})

export default defineConfig({
  format: ["esm", "cjs"],
  dts: true,
  entry: ["./src/styles.css", ...tsupEntry],
  external: ["react", "react-dom"],
})
