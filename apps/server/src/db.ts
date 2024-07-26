import { Schema } from "@repo/data/models"
import { MultiFileTable } from "./persistence/multi-file-db"
import { Table } from "./persistence/types"
import { NonEmptyArray } from "./util"

export type DB = Readonly<{
  [K in keyof Schema]: Table<string, Schema[K]>
}>

export const db: DB = {
  spaces: new MultiFileTable("./database/spaces"),
  users: new MultiFileTable("./database/users"),
  appdata: new MultiFileTable("./database/appData"),
  apps: new MultiFileTable("./database/apps"),
}

export type DBKey = keyof DB

export const dbKeys = Object.keys(db) as NonEmptyArray<DBKey>
