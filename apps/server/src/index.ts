import { App } from "@coat-rack/core/models"
import * as trpcExpress from "@trpc/server/adapters/express"
import cors from "cors"
import express from "express"
import { Server } from "http"
import { createProxyMiddleware } from "http-proxy-middleware"
import { join, resolve } from "path"
import { initDb } from "./db"
import { appRouter, seedDb } from "./router"

const appServers: Partial<Record<string, Server>> = {}

function setupAppServer(app: App) {
  const existing = appServers[app.id]
  if (existing) {
    console.log("Stopping app server", app)
    existing.close()
  }

  const appPath = resolve(join("_data", "catalog", app.id))

  const expressApp = express()
  expressApp.use(cors())

  if (app.devMode) {
    const devProxy = createProxyMiddleware({
      target: app.installURL,
    })

    expressApp.use("/", devProxy)
  } else {
    expressApp.use("/", express.static(appPath))
  }

  const server = expressApp.listen(app.port, () => {
    console.log("App server started", app)
  })

  appServers[app.id] = server
}

async function main() {
  const app = express()

  app.use(cors())

  const root = resolve("_data")
  const db = initDb(root)
  await seedDb(db)

  const allApps = await db.apps.getAll()

  allApps.map(setupAppServer)

  app.use(
    "/",
    trpcExpress.createExpressMiddleware({
      router: appRouter(root, db, setupAppServer),
    }),
  )

  app.listen(3000, "0.0.0.0", () => {
    console.info("Server started on port 3000")
  })
}
main()
