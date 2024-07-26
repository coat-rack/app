import * as trpcExpress from "@trpc/server/adapters/express"
import { appRouter } from "./router"

import serveIndex from "serve-index"

import cors from "cors"

import express from "express"
import { resolve } from "path"
import { db } from "./db"
const app = express()

app.use(cors())

const catalog = resolve(__dirname, "../../../catalog")

app.use(
  "/catalog",
  express.static(catalog, {}),
  serveIndex(catalog, { icons: true }),
)

app.use(
  "/",
  trpcExpress.createExpressMiddleware({
    router: appRouter(db),
  }),
)

app.listen(3000, () => {
  console.info("Server started on port 3000")
})
