import express from "express"
import { existsSync } from "fs"
import { cp, mkdir, watch } from "fs/promises"
import { join, resolve, sep } from "path"
import serveIndex from "serve-index"

const DB_PATH = resolve("../server/_data")

const INSTALLED_CATALOG_PATH = resolve("../server/_data/catalog")
const DEV_CATALOG_PATH = resolve("../../catalog")

const CHANGE_DEBOUNCE_TIME = 1000

const app = express()

app.use(
  "/",
  express.static(DEV_CATALOG_PATH, {}),
  serveIndex(DEV_CATALOG_PATH, { icons: true }),
)

app.use(
  "/db",

  express.static(DB_PATH),
  serveIndex(DB_PATH, { icons: true }),
)

app.listen(3005, () => {
  console.log("Static catalog host started on port 3005")
})

async function sync() {
  console.log("Starting file watcher")

  if (!existsSync(INSTALLED_CATALOG_PATH)) {
    await mkdir(INSTALLED_CATALOG_PATH, {
      recursive: true,
    })
  }

  const sleep = () =>
    new Promise((res) => setTimeout(res, CHANGE_DEBOUNCE_TIME))

  const watcher = watch(DEV_CATALOG_PATH, {
    recursive: true,
  })

  for await (const event of watcher) {
    console.log("File event received", event)
    const file = event.filename

    if (file) {
      const [dir] = file.split(sep)
      console.log("Detected changes ")
      await sleep()

      try {
        await cp(
          join(DEV_CATALOG_PATH, dir, "dist"),
          join(INSTALLED_CATALOG_PATH, dir),
          {
            recursive: true,
          },
        )
      } catch (err) {
        console.error("Error updating catalogapp", dir, err)
      }
    }
  }

  console.log("File watcher watcher exited")
}

sync()
