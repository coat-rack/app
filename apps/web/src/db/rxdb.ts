import { KeyValue, Push, Schema } from "@repo/data/models"
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
  appDataSchema,
  appSchema,
  metaSchema,
  spaceSchema,
  userSchema,
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

type ClientSchema = {
  [K in keyof Schema]: Schema[K][]
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

export const metaCollection = await localCollection("meta", metaSchema)

/**
 * RxDB keys must be lowercased
 */
const normalizeCollectionKey = (key: string) => key.toLowerCase()

const replicateCollection =
  (user: string, db: RxDatabase<SyncedRxSchema>) =>
  async <K extends keyof ClientSchema, T extends Schema[K]>(
    key: K,
    schema: RxJsonSchema<T>,
  ) => {
    const collectionKey = normalizeCollectionKey(key)

    const collection = await db.addCollections({
      [collectionKey]: {
        schema,
      },
    })

    return replicateRxCollection<T, number>({
      collection: collection[collectionKey],
      replicationIdentifier: `${user}-${key}-trpc-replication`,
      push: {
        handler: async (changeRows) => {
          const changes = changeRows
            .filter((row) => !row.newDocumentState._deleted)
            .map((row) => row.newDocumentState)
            .flat() as T[]

          const deletes = changeRows
            .filter((row) => row.newDocumentState._deleted)
            .map((row) => row.newDocumentState)
            .flat() as T[]

          const mutation: Push<K, T> = {
            type: key,
            changes,
            deletes,
          }

          // TRPC doesn't support generic operations so we need to cast in
          // order to keep our typing nice for consumers
          const conflicted = await trpcClient.rxdb.push.mutate(mutation as any)

          return (conflicted as unknown as T[]).map((item) => ({
            ...item,
            /**
             * RxDB uses this to track deletions, we can't store the _value in
             * our own data though as it creates conflicts
             */
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

          const documents = result.documents as T[]

          const withRxdbDeleteIndicator = documents.map((doc) => ({
            ...doc,
            _deleted: doc.isDeleted || false,
          }))

          return {
            documents: withRxdbDeleteIndicator,
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

  const appDataCollection = await replicate("appdata", appDataSchema)
  const spacesCollection = await replicate("spaces", spaceSchema)
  const appsCollection = await replicate("apps", appSchema)
  const usersCollection = await replicate("users", userSchema)

  return {
    db,
    spacesCollection,
    appDataCollection,
    appsCollection,
    usersCollection,
  }
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
