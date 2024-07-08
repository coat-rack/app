import * as trpcExpress from "@trpc/server/adapters/express"
import { appRouter } from "./router"

import cors from "cors"

import express from "express"
import { Server } from "http"
import path, { resolve } from "path"
import { db } from "./db"
import { watchAppDirectory } from "./sync-apps"

const app = express()

app.use(cors())

const catalog = resolve(__dirname, "../../../catalog")

// app.use(
//   "/catalog",
//   express.static(catalog, {}),
//   serveIndex(catalog, { icons: true }),
// )

const runningApps = new Map<string, Server>()

app.use(
  "/",
  trpcExpress.createExpressMiddleware({
    router: appRouter(db),
  }),
)

app.listen(3000, () => {
  let isFirstStart = true
  console.info("Server started on port 3000")
  watchAppDirectory(catalog, db.apps, (changes) => {
    for (const appChange of changes) {
      switch (appChange.changeType) {
        case "none":
          if (!isFirstStart) {
            break
          }
        case "new":
          const newApp = express()
            .use(cors())
            .use("/", express.static(path.join(catalog, appChange.appId)))
            .listen(appChange.manifest!.port, () =>
              console.log(
                `${appChange.appId} listening on port ${appChange.manifest?.port}`,
              ),
            )
          runningApps.set(appChange.appId, newApp)
          break
        case "remove":
          const existingApp = runningApps.get(appChange.appId)
          if (existingApp) {
            existingApp.close()
          }
          runningApps.delete(appChange.appId)
          break
        case "update":
          break
      }
    }
    isFirstStart = false
  })
})
