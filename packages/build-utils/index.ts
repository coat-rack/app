/**
 * Specifics around export setup from here: https://hirok.io/posts/package-json-exports
 */

import { readFileSync, readdirSync, writeFileSync, type Dirent } from "node:fs"
import { join } from "node:path"
import * as prettier from "prettier"

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

type BaseFileName = string & {
  __brand: "BASE_FILE_NAME"
}

function toBaseFileName(file: Dirent): BaseFileName {
  return file.name.replace(/\.(ts|tsx)$/, "") as BaseFileName
}

function getExportName(file: BaseFileName) {
  if (file === "index") {
    return "."
  }

  return "./" + file.replace(".ts", "")
}

/**
 * Any code that is intended to be in a build must be in the `src`. For the sake of consistency
 * `src` is the source for all files that end up being distributed
 */
type SrcDir = "src" | `src/${string}`

/**
 * Treats all top-level files in the `dir` as files that are meant to be exported
 * via the `package.json`'s `exports` property
 *
 * > Note that the automatic entrypoints only support TS and TSX Files
 */
export function getTsupEntrypoints(basePath: string, dir: SrcDir = "src") {
  const exportsDir = join(basePath, dir)
  const files = readdirSync(exportsDir, {
    withFileTypes: true,
  }).filter(
    (d) => (d.isFile() && d.name.endsWith(".ts")) || d.name.endsWith(".tsx"),
  )

  const baseFileNames = files.map(toBaseFileName)

  const tsupEntry = files.map((f) => `./${dir}/${f.name}`)

  const outDir = `./${dir.replace(/^src/, "dist")}/`

  const packageJsonExports = baseFileNames.reduce<PackageExports>(
    (curr, e) => ({
      ...curr,
      [getExportName(e)]: {
        require: {
          types: `${outDir}${e}.d.ts`,
          default: `${outDir}${e}.js`,
        },
        import: {
          types: `${outDir}${e}.d.mts`,
          default: `${outDir}${e}.mjs`,
        },
      },
    }),
    {},
  )

  return { tsupEntry, packageJsonExports }
}

export async function updatePackageJsonExports(
  basePath: string,
  exports: PackageExports | Record<string, string>,
) {
  const packageJson = JSON.parse(
    readFileSync(join(basePath, "package.json"), "utf-8"),
  )

  const updatedPackageJson = {
    ...packageJson,
    exports,
  }

  const formatted = await prettier.format(
    JSON.stringify(updatedPackageJson, null, 2),
    { parser: "json" },
  )
  writeFileSync("./package.json", formatted)
}

/**
 * Appends a prefix to the export path that consumers should use
 */
export function prefixExportPaths(
  prefix: string,
  packageJsonExports: PackageExports,
) {
  return Object.fromEntries(
    Object.entries(packageJsonExports).map(([key, value]) => [
      key.replace("./", `./${prefix}/`),
      value,
    ]),
  )
}
