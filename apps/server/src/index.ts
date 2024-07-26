import * as trpcExpress from "@trpc/server/adapters/express"
import { appRouter, seedDb } from "./router"

import cors from "cors"

import express from "express"
import { resolve } from "path"
import { initDb } from "./db"

async function main() {
  const app = express()

  app.use(cors())

  const root = resolve("_data")
  const db = initDb(root)
  await seedDb(db)

  // app.use(
  //   "/catalog",
  //   express.static(catalog, {}),
  //   serveIndex(catalog, { icons: true }),
  // )

  app.use(
    "/",
    trpcExpress.createExpressMiddleware({
      router: appRouter(root, db),
    }),
  )

  app.listen(3000, () => {
    console.info("Server started on port 3000")
  })
}
main()
