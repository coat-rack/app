import { Note, Schema, Todo } from "@repo/data/models"
import { useEffect, useState } from "react"
import { RxCollection, RxJsonSchema, addRxPlugin, createRxDatabase } from "rxdb"
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode"
import { replicateRxCollection } from "rxdb/plugins/replication"
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie"
import { Observable } from "rxjs"
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
    space: {
      type: "string",
    },
    type: {
      type: "string",
    },
    timestamp: {
      type: "number",
    },
    id: {
      // Primary key requires a max length
      maxLength: 100,
      type: "string",
    },
    isDeleted: {
      type: "boolean",
    },
    title: {
      type: "string",
    },
    done: {
      type: "boolean",
    },
  },
  required: ["id", "title", "done", "type", "space"],
}

const noteSchema: RxJsonSchema<Note> = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    space: {
      type: "string",
    },
    type: {
      type: "string",
    },
    timestamp: {
      type: "number",
    },
    id: {
      // Primary key requires a max length
      maxLength: 100,
      type: "string",
    },
    isDeleted: {
      type: "boolean",
    },
    title: {
      type: "string",
    },
    content: {
      type: "string",
    },
  },
  required: ["id", "title", "type", "space", "content"],
}

export const db = await createRxDatabase<RxSchema>({
  name: "mydatabase",
  storage: getRxStorageDexie(),
})

const replicateCollection = async <K extends keyof Schema>(
  key: K,
  schema: RxJsonSchema<Schema[K][number]>,
) => {
  const collection = await db.addCollections({
    [key]: {
      schema,
    },
  })

  return replicateRxCollection<Schema[K][number], number>({
    collection: collection[key],
    replicationIdentifier: key + "-trpc-replication",
    push: {
      handler: async (changeRows) => {
        console.log({ changeRows })

        const changes = changeRows
          .filter((row) => !row.newDocumentState._deleted)
          .map((row) => row.newDocumentState)
          .flat()

        console.log({ changes })

        const deletes = changeRows
          .filter((row) => row.newDocumentState._deleted)
          .map((row) => row.newDocumentState)
          .flat()

        console.log({ changes, deletes })

        const conflicted = await trpcClient.rxdb.push.mutate({
          changes: {
            [key]: changes,
          },
          deletes: {
            [key]: deletes,
          },
        })

        console.log({ conflicted })

        return conflicted.map((item) => ({
          ...item,
          _deleted: item.isDeleted || false,
        }))
      },
    },

    pull: {
      handler: async (baseCheckpoint, batchSize) => {
        // For some reason RxDB sometimes sets the checkpoint to an object and not a number
        const checkpoint =
          typeof baseCheckpoint === "number" ? baseCheckpoint : 0

        console.log({ checkpoint, batchSize })

        const result = await trpcClient.rxdb.pull.query({
          batchSize,
          checkpoint,
          collection: key,
        })

        const documents = result.documents[key]?.map((doc) => ({
          ...doc,
          _deleted: doc.isDeleted || false,
        }))

        return {
          documents,
          checkpoint: result.checkpoint,
        }
      },
    },
  })
}

const todosCollection = await replicateCollection("todos", todoSchema)
const notesCollection = await replicateCollection("notes", noteSchema)

export const useObservable = <T extends any>(obs: Observable<T>) => {
  const [value, setValue] = useState<T>()

  useEffect(() => {
    obs.subscribe(setValue)
  }, [])

  return value
}
