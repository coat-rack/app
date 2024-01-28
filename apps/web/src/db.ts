import { Schema, Todo } from "@repo/data/models"
import { RxCollection, RxJsonSchema, addRxPlugin, createRxDatabase } from "rxdb"
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode"
import { replicateRxCollection } from "rxdb/plugins/replication"
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie"
import { trpcClient } from "./trpc"

// Enable Dev Mode - this allows us to be a little loose with schemas while we're still figuring things out
addRxPlugin(RxDBDevModePlugin)

type CreateRxSchema<T extends Record<string, Array<any>>> = {
  [K in keyof T]: RxCollection<T[K][number]>
}

type RxSchema = CreateRxSchema<Schema>

const todoSchema: RxJsonSchema<Todo> = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    timestamp: {
      type: "number",
    },
    id: {
      // Primary key requires a max length
      maxLength: 100,
      type: "string",
    },
    dltd: {
      type: "boolean",
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

export const db = await createRxDatabase<RxSchema>({
  name: "mydatabase",
  storage: getRxStorageDexie(),
})

await db.addCollections({
  todos: {
    schema: todoSchema,
  },
})

const replicateCollection = <K extends keyof Schema>(key: K) =>
  replicateRxCollection<Schema[K], number>({
    collection: "my-database-key",
    replicationIdentifier: key + " trpc-replication",
    push: {
      handler: async (changeRows) => {
        console.log(changeRows)

        const changes = changeRows
          .filter((row) => !row.newDocumentState._deleted)
          .map((row) => row.newDocumentState.map((doc) => doc))
          .flat()

        const deletes = changeRows
          .filter((row) => row.newDocumentState._deleted)
          .map((row) => row.newDocumentState.map((doc) => doc))
          .flat()

        const conflicted = await trpcClient.rxdb.push.mutate({
          changes: {
            [key]: changes,
          },
          deletes: {
            [key]: deletes,
          },
        })

        return conflicted
      },
    },

    pull: {
      handler: async (checkpoint, batchSize) => {
        console.log(checkpoint, batchSize)

        const result = await trpcClient.rxdb.pull.query({
          batchSize,
          checkpoint,
          collection: key,
        })

        return {
          ...result,
          checkpoint: checkpoint || null,
        }
      },
    },
  })

// const todosReplication = await replicateCollection("todos")
