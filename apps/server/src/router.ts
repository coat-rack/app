import { z } from "zod"
import { publicProcedure, router } from "./trpc"

import { Schema } from "@repo/data/models"
import { Database } from "./db"

interface DB extends Schema {
  checkpoint: number
}

const db = new Database<DB>("./database.json", {
  checkpoint: Date.now(),
  todos: [],
  notes: [],
})

const schemaKey = Schema.keyof()

/**
 * Implements handling for https://rxdb.info/replication-http.html
 */
export const rxdbRouter = router({
  pull: publicProcedure
    .input(
      z.object({
        collection: schemaKey,
        checkpoint: z.number().optional(),
        batchSize: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const collection = Object.values(db.data[input.collection])

      console.log("pull", {
        input,
      })
      return {
        checkpoint: db.data.checkpoint,
        documents: {
          [input.collection]: collection,
        },
      }
    }),

  push: publicProcedure
    .input(
      z.object({
        changes: Schema.partial(),
        deletes: Schema.partial(),
      }),
    )
    .mutation(async ({ input }) => {
      const conflicting: Schema[keyof Schema][number][] = []

      const changeKeys = Object.keys(input.deletes) as z.infer<
        typeof schemaKey
      >[]

      for (const key of changeKeys) {
        const collection = db.data[key]
        for (const change of input.changes[key] || []) {
          const existingIndex = collection.findIndex(
            (item) => item.id === change.id,
          )

          const existing = collection[existingIndex]

          if (existing && existing.timestamp >= change.timestamp) {
            conflicting.push(existing)
          } else if (existing) {
            collection[existingIndex] = change
          } else {
            // Not fun but don't really have a better way and it's not worth
            // finding one until we have a "real" plan for the data storage
            collection.push(change as any)
          }
        }
      }

      const keys = Object.keys(input.deletes) as z.infer<typeof schemaKey>[]

      for (const key of keys) {
        const collection = db.data[key]
        for (const dlt of input.deletes[key] || []) {
          const existingIndex = collection.findIndex(
            (item) => item.id === dlt.id,
          )

          const existing = collection[existingIndex]
          if (existing && existing.timestamp <= dlt.timestamp) {
            db.data[key][existingIndex] = {
              ...dlt,
              isDeleted: true,
            }
          } else if (existing && existing.timestamp >= dlt.timestamp) {
            conflicting.push(existing)
          }
        }
      }

      db.commit()

      console.log("push", {
        input,
      })
      // Should return any conflicting records
      return conflicting
    }),

  // This method needs to return any other changes that are not from the current client
  pullStream: publicProcedure.subscription((sub) => {
    console.log("Subscription", sub)
  }),
})

export const appRouter = router({
  rxdb: rxdbRouter,
})
