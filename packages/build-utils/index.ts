/**
 * Specifics around export setup from here: https://hirok.io/posts/package-json-exports
 */

import { readFileSync, readdirSync, writeFileSync, type Dirent } from "node:fs"
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
 * Treats all top-level files in the `dir` as files that are meant to be exported
 * via the `package.json`'s `exports` property
 *
 * > Note that the automatic entrypoints only support TS and TSX Files
 */
export function getTsupEntryPoints(basePath: string, dir = "src") {
  const exportsDir = join(basePath, dir)
  const files = readdirSync(exportsDir, {
    withFileTypes: true,
  }).filter(
    (d) => (d.isFile() && d.name.endsWith(".ts")) || d.name.endsWith(".tsx"),
  )

  const baseFileNames = files.map(toBaseFileName)

  const tsupEntry = files.map((f) => `./${dir}/${f.name}`)

  const outDir = `./dist${dir.replace("src", "")}/`

  const packageJsonExports = baseFileNames.reduce<PackageExports>(
    (curr, e) => ({
      ...curr,
      [getExportName(e)]: {
        require: {
          types: `${outDir + e}.d.ts`,
          default: `${outDir + e}.js`,
        },
        import: {
          types: `${outDir + e}.d.mts`,
          default: `${outDir + e}.mjs`,
        },
      },
    }),
    {},
  )

  return { tsupEntry, packageJsonExports }
}

export function updatePackageJsonExports(
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

  writeFileSync("./package.json", JSON.stringify(updatedPackageJson, null, 2))
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
