import { Schema } from "@coat-rack/core/models"
import { join } from "path"
import { MultiFileTable } from "./persistence/multi-file-db"
import { Table, TableRow } from "./persistence/types"
import { NonEmptyArray } from "./util"

type PublicKey = {
  id: string
  key: string
}

export interface UserCredential extends TableRow<string> {
  publicKeys: PublicKey[]
}

type ServerDB = Schema & {
  userCredentials: UserCredential
}

const dbDirName = "database"
export type DB = Readonly<{
  [K in keyof ServerDB]: Table<string, ServerDB[K]>
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
    userCredentials: new MultiFileTable(join(dbName, "userCredentials")),

    appdata: new MultiFileTable(join(dbName, "appData")),
    apps: new MultiFileTable(join(dbName, "apps")),
  }
  return db
}

export const PUBLIC_SPACE_ID = "public"
