import { createHTTPServer } from "@trpc/server/adapters/standalone"
import { appRouter } from "./router"

import cors from "cors"

const server = createHTTPServer({
  middleware: cors(),
  router: appRouter,
})

server.listen(3000)
