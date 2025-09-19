#!/usr/bin/env node
import { App, User } from "@coat-rack/core/models"
import * as trpcExpress from "@trpc/server/adapters/express"
import cors from "cors"
import express from "express"
import session from "express-session"
import { Server } from "http"
import { createProxyMiddleware } from "http-proxy-middleware"
import { resolve } from "path"
import { createAuthentication } from "./auth"
import { registerCaddyServer } from "./caddy"
import {
  DB_PATH,
  HOST,
  IS_DEV,
  PORT,
  PUBLIC_DOMAIN,
  SESSION_SECRET,
} from "./config"
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
  const sandboxPath = resolve(__dirname, "sandbox")

  const expressApp = express()
  expressApp.use(cors())

  if (app.devMode) {
    const appProxy = createProxyMiddleware({
      target: app.installURL,
    })

    expressApp.use("/_app", appProxy)
  } else {
    expressApp.use("/_app", express.static(appPath))
  }

  if (IS_DEV) {
    const sandboxProxy = createProxyMiddleware({
      target: `http://${HOST}:${PORT.sandbox}/`,
    })

    expressApp.use("/", sandboxProxy)
  } else {
    expressApp.use("/", express.static(sandboxPath))

    expressApp.get("*", function (_, res) {
      res.sendFile(resolve(sandboxPath, "index.html"))
    })
  }

  const server = expressApp.listen(app.port, async () => {
    console.log(`${app.id} App server started on port ${app.port}`, app)

    if (!IS_DEV) {
      const caddyResult = await registerCaddyServer(app.id, app.port)
      console.log(`${app.id} App server registered with Caddy`, caddyResult)
    }
  })

  appServers[app.id] = server
}

async function web(app: express.Application) {
  if (IS_DEV) {
    const target = `http://${HOST}:${PORT.webDev}/`
    const webProxy = createProxyMiddleware({
      target,
    })

    app.use("/", webProxy)
  } else {
    const path = resolve(__dirname, "web")

    app.use(cors())

    app.use("/", express.static(path))

    app.get("*", function (_, res) {
      res.sendFile(resolve(path, "index.html"))
    })

    app.listen(PORT.webDev, HOST, () => {
      console.info(`Host for Web started on port ${PORT.webDev}`)
    })
  }
}

async function main() {
  const app = express()

  app.use(cors())
  app.use(express.json())

  const root = resolve("_data")
  const db = initDb(root)
  await seedDb(db, IS_DEV)

  const allApps = await db.apps.getAll()

  allApps.map(setupAppServer)

  const auth = createAuthentication(db)

  // session middleware is required for passport
  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  )

  // app.use(auth.passport.session())

  // app.use(auth.passport.authenticate("session"))

  // once this is all working it may be worth trying to put it
  // into trpc so we can get some nice types, etc.
  app.post("/login/public-key/challenge", (req, res, next) => {
    auth.store.challenge(req, (err, challenge) => {
      if (err) {
        return next(err)
      }

      // buffers are JSON encoded automatically
      // same as challenge: challenge.toJSON()
      // this can be decoded with new Buffer(challenge) directly in Node.js
      res.json({ challenge, rpId: PUBLIC_DOMAIN })
    })
  })

  app.post("/register/public-key/challenge", (req, res, next) => {
    const username = req.body.name
    if (!username) {
      throw new Error("Expected `name` to be provided in body")
    }
    const id = Buffer.from(new TextEncoder().encode(username))
    const user = {
      id,
      name: username,
      displayName: username,
    }

    auth.store.challenge(req, { user }, (err, challenge) => {
      if (err) {
        return next(err)
      }

      const id = new TextDecoder().decode(user.id)
      const serializedUser = {
        ...user,
        id,
      }

      // buffers are JSON encoded automatically
      // same as challenge: challenge.toJSON()
      // this can be decoded with new Buffer(challenge) directly in Node.js
      res.json({
        challenge,
        user: serializedUser,
        rpId: PUBLIC_DOMAIN,
      })
    })
  })

  app.post(
    "/login/public-key",
    auth.passport.authenticate("webauthn", {
      failWithError: true,
      failureMessage: true,
      session: false,
    }),
    function verified(_req, res) {
      res.status(200)
      res.json({
        ok: true,
      })
    },
  )

  app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter(root, db, setupAppServer),

      createContext: ({ req }: trpcExpress.CreateExpressContextOptions) => {
        const user = req.user as User | undefined

        return {
          user: user?.id,
        }
      },
    }),
  )

  await web(app)

  app.listen(PORT.server, HOST, () => {
    console.info(`Server started on port ${PORT.server}`)
  })
}

main()

// in dev the applications are hosted by the Vite server
// in order to simplify things we're keeping the same behavior here
