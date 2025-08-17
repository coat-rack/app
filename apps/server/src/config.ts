import { resolve } from "path"

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production"
      DB_PATH?: string
      CADDY_ADMIN_HOST?: string
      CADDY_EXTERNAL_DOMAIN?: string
      COAT_RACK_DOMAIN?: string
      SESSION_SECRET?: string
      PUBLIC_DOMAIN?: string
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

export const DB_PATH = process.env.DB_PATH || resolve("_data")

export const CADDY_ADMIN_HOST = process.env.CADDY_ADMIN_HOST
export const COAT_RACK_DOMAIN = process.env.COAT_RACK_DOMAIN
export const CADDY_EXTERNAL_DOMAIN = process.env.CADDY_EXTERNAL_DOMAIN

const ENV = process.env.NODE_ENV || "production"

export const IS_DEV = ENV === "development"

export const SESSION_SECRET =
  process.env.SESSION_SECRET || "placeholder session secret"

/**
 * Relying Party ID needed for the Web Authn API
 */
export const PUBLIC_DOMAIN = process.env.PUBLIC_DOMAIN || "localhost"
