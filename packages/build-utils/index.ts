/**
 * Specifics around export setup from here: https://hirok.io/posts/package-json-exports
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

type ExportPaths = {
  default: string
  types: string
}

export type PackageExports = Record<
  string,
  {
    require: ExportPaths
    import: ExportPaths
  }
>

function getExportName(file: string) {
  if (file === "index.ts") {
    return "."
  }

  return "./" + file.replace(".ts", "")
}

function getDistPath(file: string, newExt: string) {
  return "./dist/" + file.replace(".ts", newExt)
}

/**
 * Treats all top-level files in the `src` dir as files that are meant to be exported
 * via the `package.json`'s `exports` property
 */
export function getTsupEntryPoints(basePath: string) {
  const files = readdirSync(join(basePath, "src"), {
    withFileTypes: true,
  })
    .filter((d) => d.isFile() && d.name.endsWith(".ts"))
    .map((f) => f.name)

  const tsupEntry = files.map((f) => `./src/${f}`)

  const packageJsonExports = files.reduce<PackageExports>(
    (curr, e) => ({
      ...curr,
      [getExportName(e)]: {
        require: {
          types: getDistPath(e, ".d.ts"),
          default: getDistPath(e, ".js"),
        },
        import: {
          types: getDistPath(e, ".d.mts"),
          default: getDistPath(e, ".mjs"),
        },
      },
    }),
    {},
  )

  return { tsupEntry, packageJsonExports }
}

export function updatePackageJsonExports(
  basePath: string,
  exports: PackageExports,
) {
  const packageJson = JSON.parse(
    readFileSync(join(basePath, "package.json"), "utf-8"),
  )

  const updatedPackageJson = {
    ...packageJson,
    exports,
  }

  writeFileSync("./package.json", JSON.stringify(updatedPackageJson, null, 2))
}
