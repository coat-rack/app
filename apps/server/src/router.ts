import { z } from "zod"
import { publicProcedure, router } from "./trpc"

import { Schema, Space, User, UserSpaces } from "@repo/data/models"
import { Database } from "./db"

interface DB extends Schema {
  checkpoint: number
  spaces: Space[]
  users: User[]
  userSpaces: UserSpaces
}

const db = new Database<DB>("./database.json", {
  checkpoint: Date.now(),
  spaces: [
    {
      id: "public",
      name: "public",
      isUserSpace: false,
    },
    {
      // Each user has a space defined for them
      id: "admin",
      name: "admin",
      isUserSpace: true,
    },
  ],
  users: [
    {
      id: "admin",
      name: "admin",
    },
  ],
  userSpaces: {
    admin: ["public", "admin"],
  },
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
        userId: z.string(),
        checkpoint: z.number().optional(),
        batchSize: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const collection = db.data[input.collection]
      const userSpaces = db.data["userSpaces"][input.userId] || []
      const userRecords = collection.filter((item) =>
        userSpaces.includes(item.space),
      )

      console.log("pull", {
        input,
      })

      return {
        checkpoint: db.data.checkpoint,
        documents: {
          [input.collection]: userRecords,
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

      const deleteKeys = Object.keys(input.deletes) as z.infer<
        typeof schemaKey
      >[]

      for (const key of deleteKeys) {
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
