import { z } from "zod"
import { publicProcedure, router } from "./trpc"

import { Schema, Todo } from "@repo/data/models"

// Using In Memory for now, we can remove this when we decide on a data management plan
// this is just to get sync working

interface DB {
  checkpoint: number
  todos: Record<string, Todo>
}

const db: DB = {
  checkpoint: Date.now(),
  todos: {},
}

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
      const collection = Object.values(db[input.collection])

      console.log({ input, collectionCount: Object.keys(db.todos).length })
      return {
        checkpoint: db.checkpoint,
        documents: {
          [input.collection]: collection,
        },
      }
    }),

  push: publicProcedure
    .input(
      z.object({
        collection: schemaKey,
        changes: Schema.partial(),
        deletes: Schema.partial(),
      }),
    )
    .mutation(async ({ input }) => {
      const conflicting: Schema[typeof input.collection] = []

      for (const change of input.changes[input.collection] || []) {
        const existing = db[input.collection][change.id]
        if (existing && existing.id >= change.id) {
          conflicting.push(existing)
        } else {
          db[input.collection][change.id] = change
        }
      }

      for (const dlt of input.deletes.todos || []) {
        db[input.collection][dlt.id] = { ...dlt, dltd: true }
      }

      console.log({ input, collectionCount: Object.keys(db.todos).length })
      // Should return any conflicting records
      return conflicting
    }),

  // This method needs to return any other changes that are not from the current client
  pullStream: publicProcedure.subscription(() => {}),
})

export const appRouter = router({
  rxdb: rxdbRouter,
  getName: publicProcedure.query(() => {
    return "Server Date Time: " + new Date().toString()
  }),
})
