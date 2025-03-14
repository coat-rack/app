import { Schema } from "@repo/core/models"
import { join } from "path"
import { MultiFileTable } from "./persistence/multi-file-db"
import { Table } from "./persistence/types"
import { NonEmptyArray } from "./util"

const dbDirName = "database"
export type DB = Readonly<{
  [K in keyof Schema]: Table<string, Schema[K]>
}>

export type DBKey = keyof DB

export const dbKeys = [
  "appdata",
  "apps",
  "spaces",
  "users",
] as const satisfies Readonly<NonEmptyArray<DBKey>>

export function initDb(rootDir: string) {
  const dbName = join(rootDir, dbDirName)
  const db: DB = {
    spaces: new MultiFileTable(join(dbName, "spaces")),
    users: new MultiFileTable(join(dbName, "users")),
    appdata: new MultiFileTable(join(dbName, "appData")),
    apps: new MultiFileTable(join(dbName, "apps")),
  }
  return db
}
