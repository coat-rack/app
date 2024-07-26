import * as trpcExpress from "@trpc/server/adapters/express"
import { appRouter, seedDb } from "./router"

import cors from "cors"

import { App } from "@repo/data/models"
import express, { Express } from "express"
import { join, resolve } from "path"
import { initDb } from "./db"

const appServers: Partial<Record<string, Express>> = {}

function setupAppServer(app: App) {
  const existing = appServers[app.id]
  if (existing) {
    return
  }

  const appPath = resolve(join("_data", "catalog", app.id))

  const server = express()
  server.use(cors())
  server.use("/", express.static(appPath))

  server.listen(app.port, () => {
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

  app.listen(3000, () => {
    console.info("Server started on port 3000")
  })
}
main()
