import { resolve } from "path"

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production"
    }
  }
}

export const PORT = {
  server: 3000,
  web: 4000,
  sandbox: 5000,
}

export const DB_PATH = resolve("_data")

const ENV = process.env.NODE_ENV || "production"

export const IS_DEV = ENV === "development"
