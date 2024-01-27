import { RxCollection, RxJsonSchema, addRxPlugin, createRxDatabase } from "rxdb"
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode"
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie"

// Enable Dev Mode - this allows us to be a little loose with schemas while we're still figuring things out
addRxPlugin(RxDBDevModePlugin)

interface Schema {
  todos: RxCollection<Todo>
}

interface Todo {
  id: string
  done: boolean
  title: string
}

const todoSchema: RxJsonSchema<Todo> = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100, // <- the primary key must have set maxLength
    },
    title: {
      type: "string",
    },
    done: {
      type: "boolean",
    },
  },
  required: ["id", "title", "done"],
}

export const db = await createRxDatabase<Schema>({
  name: "mydatabase",
  storage: getRxStorageDexie(),
})

await db.addCollections({
  todos: {
    schema: todoSchema,
  },
})
