import { resolve } from "path"

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production"
    }
  }
}

/**
 * the host needs to be an IP (not "localhost") so that Node.js will expose
 * the application as well as so that we can proxy since Node.js doesn't
 * support proxying to "localhost"
 */
export const HOST = "0.0.0.0"

export const PORT = {
  server: 3000,
  web: 4000,
  sandbox: 5000,
}

export const DB_PATH = resolve("_data")

const ENV = process.env.NODE_ENV || "production"

export const IS_DEV = ENV === "development"
