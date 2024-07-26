import { Manifest } from "@repo/data/models"
import { existsSync } from "fs"
import { mkdir, writeFile } from "fs/promises"
import path from "path"

const catalogDirName = "catalog"

const manifestFileName = "manifest.json"
const indexFileName = "index.mjs"

async function ensureCatalogFolder(rootDir: string) {
  const catalogDir = path.join(rootDir, catalogDirName)

  if (!existsSync(catalogDir)) {
    await mkdir(catalogDir, { recursive: true })
  }
}

export async function addToCatalog(rootDir: string, url: URL) {
  await ensureCatalogFolder(rootDir)

  const destDir = path.join(rootDir, catalogDirName)

  const manifestUrl = new URL(manifestFileName, url)
  const jsUrl = new URL(indexFileName, url)
  const manifestTask = fetch(manifestUrl)
    .then((res) => res.json())
    .then(Manifest.parseAsync)

  const jsTask = fetch(jsUrl).then((res) => res.text())
  const [manifest, index] = await Promise.all([manifestTask, jsTask])

  const name = manifest.name

  await Promise.all([
    writeFile(
      path.join(destDir, name, manifestFileName),
      JSON.stringify(manifest),
    ),
    writeFile(path.join(destDir, name, indexFileName), index),
  ])

  return manifest
}
