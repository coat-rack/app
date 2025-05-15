#!/usr/bin/env node
import { App } from "@coat-rack/core/models"
import * as trpcExpress from "@trpc/server/adapters/express"
import cors from "cors"
import express from "express"
import { Server } from "http"
import { createProxyMiddleware } from "http-proxy-middleware"
import { resolve } from "path"
import { DB_PATH, IS_DEV, PORT } from "./config"
import { initDb } from "./db"
import { appRouter, seedDb } from "./router"

const appServers: Partial<Record<string, Server>> = {}

function setupAppServer(app: App) {
  const existing = appServers[app.id]
  if (existing) {
    console.log("Stopping app server", app)
    existing.close()
  }

  const appPath = resolve(DB_PATH, "catalog", app.id)

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
  await seedDb(db, IS_DEV)

  const allApps = await db.apps.getAll()

  allApps.map(setupAppServer)

  app.use(
    "/",
    trpcExpress.createExpressMiddleware({
      router: appRouter(root, db, setupAppServer),
    }),
  )

  app.listen(PORT.server, "0.0.0.0", () => {
    console.info("Server started on port 3000")
  })
}

async function serve(path: string, port: number) {
  const app = express()

  app.use(cors())

  app.use("/", express.static(path))

  app.get("*", function (_, res) {
    res.sendFile(resolve(path, "index.html"))
  })

  app.listen(port, "0.0.0.0", () => {
    console.info(`Static host for ${path} started on port ${port}`)
  })
}

main()

// in dev the applications are hosted by the Vite server
// in order to simplify things we're keeping the same behavior here
if (!IS_DEV) {
  serve(resolve(__dirname, "web"), PORT.web)
  serve(resolve(__dirname, "sandbox"), PORT.sandbox)
}
