import { z } from "zod"
import { publicProcedure, router } from "./trpc"

import { Schema } from "@repo/data/models"

// Using LowDB for now, we can remove this when we decide on a data management plan
// this is just to get sync working
// const db =

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
    .query(({ input }) => {
      return {
        checkpoint: input.checkpoint,
        documents: [],
      }
    }),

  push: publicProcedure
    .input(
      z.object({
        changes: Schema.partial(),
        deletes: Schema.partial(),
      }),
    )
    .mutation(({ input }) => {
      console.log(input)

      // Should return any conflicting records
      return []
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
