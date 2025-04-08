import { defineConfig } from "tsup"
// direct import since otherwise we need to compile the internal package
import { getTsupEntrypoints, updatePackageJsonExports } from "../build-utils"

const { packageJsonExports, tsupEntry } = getTsupEntrypoints(__dirname)

updatePackageJsonExports(__dirname, packageJsonExports)

export default defineConfig({
  format: ["esm", "cjs"],
  dts: true,
  entry: tsupEntry,
  external: ["react", "react-dom"],
})
