import { Schema, Space, TodoJsonSchema } from "@repo/data/models"
import {
  RxCollection,
  RxDatabase,
  RxJsonSchema,
  addRxPlugin,
  createRxDatabase,
} from "rxdb"
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode"
import { RxDBLocalDocumentsPlugin } from "rxdb/plugins/local-documents"
import { replicateRxCollection } from "rxdb/plugins/replication"
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie"
import { trpcClient } from "../trpc"

import { RxDBUpdatePlugin } from "rxdb/plugins/update"
import { map } from "rxjs"
import { useObservable } from "../async"
import {
  KeyValue,
  metaSchema,
  noteSchema,
  spaceSchema,
  todoSchema,
} from "./schema"

// Enable Dev Mode - this allows us to be a little loose with schemas while we're still figuring things out
addRxPlugin(RxDBDevModePlugin)
addRxPlugin(RxDBLocalDocumentsPlugin)
addRxPlugin(RxDBUpdatePlugin)

type CreateRxSchema<T extends Record<string, Array<any>>> = {
  [K in keyof T]: RxCollection<T[K][number]>
}

type LocalSchema = {
  /**
   * Key-value metadata local metadata
   */
  meta: KeyValue[]
}

type LocalRxSchema = CreateRxSchema<LocalSchema>

type ClientSchema = Schema & {
  spaces: Space[]
}

export type SyncedRxSchema = CreateRxSchema<ClientSchema>

/**
 * Device specific data that is not synchronized over the network. For local
 * application state and session context
 */
export const localDB = await createRxDatabase<LocalRxSchema>({
  name: "local-db",
  storage: getRxStorageDexie(),
  localDocuments: true,
  ignoreDuplicate: true,
})

const localCollection = <K extends keyof LocalSchema>(
  key: K,
  schema: RxJsonSchema<LocalSchema[K][number]>,
) =>
  localDB.addCollections({
    [key]: {
      schema,
      localDocuments: true,
    },
  })

const metaCollection = await localCollection("meta", metaSchema)

const replicateCollection =
  (user: string, db: RxDatabase<SyncedRxSchema>) =>
  async <K extends keyof ClientSchema>(
    key: K,
    schema: RxJsonSchema<ClientSchema[K][number]>,
  ) => {
    const collection = await db.addCollections({
      [key]: {
        schema,
      },
    })

    return replicateRxCollection<ClientSchema[K][number], number>({
      collection: collection[key],
      replicationIdentifier: `${user}-${key}-trpc-replication`,
      push: {
        handler: async (changeRows) => {
          const changes = changeRows
            .filter((row) => !row.newDocumentState._deleted)
            .map((row) => row.newDocumentState)
            .flat()

          const deletes = changeRows
            .filter((row) => row.newDocumentState._deleted)
            .map((row) => row.newDocumentState)
            .flat()

          const conflicted = await trpcClient.rxdb.push.mutate({
            changes: {
              [key]: changes,
            },
            deletes: {
              [key]: deletes,
            },
          })

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

          const result = await trpcClient.rxdb.pull.query({
            userId: user,
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

export const USER_META_KEY = "user"

/**
 * Initialize database for a user that can be synchronized independently
 */
export const setupUserDB = async (user: string) => {
  const db = await createRxDatabase<SyncedRxSchema>({
    name: `${user}-synced-db`,
    storage: getRxStorageDexie(),
    ignoreDuplicate: true,
  })

  const replicate = replicateCollection(user, db)

  const todosCollection = await replicate("todos", todoSchema)
  const notesCollection = await replicate("notes", noteSchema)
  const spacesCollection = await replicate("spaces", spaceSchema)

  return { db, todosCollection, notesCollection, spacesCollection }
}

export const setLocalUser = (username?: string) =>
  localDB.meta.upsertLocal<KeyValue>(USER_META_KEY, {
    id: USER_META_KEY,
    value: username,
  })

export const useLocalUser = () =>
  useObservable(
    localDB.meta
      .getLocal$<KeyValue>(USER_META_KEY)
      .pipe(map((result) => result?._data.data.value)),
    [],
  )
