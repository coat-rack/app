import { App, Manifest } from "@repo/data/models"
import fsSync from "fs"
import fs from "fs/promises"
import path from "path"
import { Table } from "./persistence/types"

const MANIFEST_NAME = "manifest.json"

type ManifestSyncResult = {
  appId: string
  changeType: "new" | "update" | "remove" | "none"
  manifest: Manifest | undefined
}

async function syncManifest(
  appRoot: string,
  appFolder: string,
  appsTable: Table<string, App>,
): Promise<ManifestSyncResult> {
  // 1. look for a manifest
  let manifest: Manifest | undefined
  try {
    const contents = await fs.readFile(
      path.join(appRoot, appFolder, "dist", MANIFEST_NAME),
    )
    manifest = await Manifest.parseAsync(JSON.parse(contents.toString()))
  } catch (e) {
    console.error(`Could not open/parse manifest for app ${appFolder}`, e)
  }

  if (!manifest) {
    throw `'${appFolder}' does not contain a valid manifest, skipping`
  }

  // 2. compare to db
  const matchingAppEntry = await appsTable.get(manifest.id)
  if (!matchingAppEntry) {
    // 2.a. add new entry
    await appsTable.putItems([
      {
        type: "app",
        id: manifest.id,
        url: "",
        timestamp: manifest.timestamp,
        manifestUrl: "",
      },
    ])
    return {
      appId: manifest.id,
      changeType: "new",
      manifest,
    }
  } else {
    console.log(
      `${manifest.id}: manifest.timestamp = ${manifest.timestamp} matchingAppEntry.timestamp = ${matchingAppEntry.timestamp}`,
    )
    // 2.b. update existing entry
    if (manifest.timestamp != matchingAppEntry.timestamp) {
      matchingAppEntry.timestamp = manifest.timestamp
      await appsTable.putItems([matchingAppEntry])
      return {
        appId: manifest.id,
        changeType: "update",
        manifest,
      }
    }
  }
  return {
    appId: manifest.id,
    changeType: "none",
    manifest,
  }
}

async function syncApps(appDir: string, appsTable: Table<string, App>) {
  const appFolders = await fs.readdir(appDir)

  console.log(`synchronizing appdir folder '${appDir} with db...`)
  const syncResults = await Promise.allSettled(
    appFolders.map((folder) => syncManifest(appDir, folder, appsTable).then()),
  )

  const appChanges = syncResults
    .filter<PromiseFulfilledResult<ManifestSyncResult>>(
      (x): x is PromiseFulfilledResult<ManifestSyncResult> =>
        x.status == "fulfilled",
    )
    .map((r) => r.value)

  const failedResults = syncResults.filter<PromiseRejectedResult>(
    (x): x is PromiseRejectedResult => x.status == "rejected",
  )

  if (failedResults.length) {
    console.warn(`bad things happened!`, failedResults)
  }

  const allApps = await appsTable.getAll()

  const extraneousApps = allApps.filter(
    (app) => !appChanges.some((change) => change.appId == app.id),
  )

  const results = [...appChanges]
  if (extraneousApps.length) {
    const extraneousAppIds = extraneousApps.map((a) => a.id)
    console.warn(`the following apps have disappeared: `, extraneousAppIds)
    extraneousApps.forEach((app) => {
      app.isDeleted = true
    })
    appsTable.putItems(extraneousApps)
    results.push(
      ...extraneousAppIds.map(
        (id) => ({ appId: id, changeType: "remove" }) as ManifestSyncResult,
      ),
    )
  }

  return appChanges
}

export function watchAppDirectory(
  appDir: string,
  appsTable: Table<string, App>,
  callback: (changes: ManifestSyncResult[]) => void,
) {
  syncApps(appDir, appsTable).then((initialChanges) => {
    if (initialChanges.length) {
      callback(initialChanges)
    }
    const watcher = fsSync.watch(appDir, { recursive: true })
    let t: NodeJS.Timeout | undefined
    watcher.on("change", (type, filename) => {
      console.debug(
        `detected file change, type = '${type}' filename = '${filename}'`,
      )
      if (t) {
        clearTimeout(t)
        t = undefined
      }
      t = setTimeout(() => {
        t = undefined
        syncApps(appDir, appsTable).then((changes) => callback(changes))
      }, 500)
    })
  })
}
