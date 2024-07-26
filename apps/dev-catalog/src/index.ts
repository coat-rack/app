import express from "express"
import { cp, watch } from "fs/promises"
import { join, resolve } from "path"
import serveIndex from "serve-index"

const app = express()

const installedCatalogPath = resolve("../server/_data/catalog")
const devCatalogPath = resolve("../../catalog")

app.use(
  "/",
  express.static(devCatalogPath, {}),
  serveIndex(devCatalogPath, { icons: true }),
)

app.listen(3005, () => {
  console.log("Static catalog host started on port 3005")
})

async function sync() {
  console.log("Starting watcher")

  const watcher = watch(devCatalogPath, {
    recursive: true,
  })

  for await (const event of watcher) {
    console.log("File event received", event)
    const file = event.filename

    if (file) {
      const [dir] = file.split("/")
      try {
        await cp(join(devCatalogPath, dir), join(installedCatalogPath, dir), {
          recursive: true,
        })
      } catch (err) {
        console.error("Error updating catalogapp", dir, err)
      }
    }
  }

  console.log("End of watcher")
}

sync()
