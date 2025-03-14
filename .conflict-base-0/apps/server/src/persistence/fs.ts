import { Manifest } from "@repo/core/models"
import { existsSync } from "fs"
import { mkdir, writeFile } from "fs/promises"
import path from "path"

const catalogDirName = "catalog"

const manifestFileName = "manifest.json"
const indexFileName = "index.mjs"

async function ensureFolder(dir: string) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true })
  }
}

export async function addToCatalog(rootDir: string, url: URL) {
  const destDir = path.join(rootDir, catalogDirName)
  await ensureFolder(destDir)

  const manifestUrl = new URL(manifestFileName, url)
  const jsUrl = new URL(indexFileName, url)
  const manifestTask = fetch(manifestUrl)
    .then((res) => res.json())
    .then(Manifest.parseAsync)

  const jsTask = fetch(jsUrl).then((res) => res.text())
  const [manifest, index] = await Promise.all([manifestTask, jsTask])

  const name = manifest.name
  const appDir = path.join(destDir, name)
  await ensureFolder(appDir)

  await Promise.all([
    writeFile(path.join(appDir, manifestFileName), JSON.stringify(manifest)),
    writeFile(path.join(appDir, indexFileName), index),
  ])

  return manifest
}
