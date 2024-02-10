import { z } from "zod"
import { publicProcedure, router } from "./trpc"

import { Schema, Space, User, UserSpaces } from "@repo/data/models"
import { Database } from "./db"

/**
 * Need to make this somehow managable and installable from the datbase. Not
 * doing this right now as it will add some complexity as we have not yet
 * determined how we will manage installations more generally
 **/
interface App {
  name: string
  url: string
}

const apps: App[] = [
  {
    name: "sample-app",
    url: "http://localhost:3000/catalog/sample-app/dist/index.mjs",
  },

  {
    name: "tasks",
    url: "http://localhost:3000/catalog/tasks/dist/index.mjs",
  },
]

interface DB extends Schema {
  checkpoint: number
  spaces: Space[]
  users: User[]
  userSpaces: UserSpaces
}

type Row = Schema[keyof Schema][number]

const PUBLIC_SPACE_ID = "public"

const db = new Database<DB>("./database.json", {
  checkpoint: Date.now(),
  spaces: [
    {
      type: "space",
      id: PUBLIC_SPACE_ID,
      timestamp: Date.now(),
      name: "public",
      isUserSpace: false,
    },
    {
      // Each user has a space defined for them
      type: "space",
      timestamp: Date.now(),
      id: "admin",
      name: "admin",
      isUserSpace: true,
    },
  ],
  users: [
    {
      id: "admin",
      name: "admin",
      type: "user",
      timestamp: Date.now(),
    },
  ],
  userSpaces: {
    admin: [
      {
        id: Date.now().toString(),
        space: PUBLIC_SPACE_ID,
        // Space relationship so we can later use timestamps to send filtered data when symchronizing
        timestamp: Date.now(),
        type: "user-space",
      },
      {
        id: Date.now().toString(),
        space: "admin",
        timestamp: Date.now(),
        type: "user-space",
      },
    ],
  },
  todos: [],
  notes: [],
})

const schemaKey = Schema.keyof()

const username = z.string().regex(/^[a-z]+$/)

/**
 * Implements handling for https://rxdb.info/replication-http.html
 */
export const rxdbRouter = router({
  pull: publicProcedure
    .input(
      z.object({
        collection: z.union([schemaKey, z.enum(["spaces"])]),
        userId: z.string(),
        checkpoint: z.number().optional(),
        batchSize: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const userSpaces = db.data.userSpaces[input.userId] || []
      const userSpaceIds = userSpaces.map((us) => us.space)
      const isUserItem = (item: Row) => userSpaceIds.includes(item.space)

      console.log(userSpaceIds)

      const spaces = db.data.spaces.filter((space) =>
        userSpaceIds.includes(space.id),
      )

      const collection =
        input.collection === "spaces"
          ? spaces
          : db.data[input.collection].filter(isUserItem)

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
  users: router({
    login: publicProcedure
      .input(
        z.object({
          name: username,
        }),
      )
      .query(({ input }) => {
        return db.data.users.find((user) => user.name === input.name)
      }),
    create: publicProcedure
      .input(
        z.object({
          name: username,
        }),
      )
      .mutation(({ input }) => {
        const id = input.name.toLowerCase()

        const user: User = {
          id,
          name: id,
          timestamp: Date.now(),
          type: "user",
        }

        const existing = db.data.users.find((u) => u.id === id)
        if (existing) {
          return existing
        }

        db.data.users.push(user)
        db.data.spaces.push({
          id,
          name: user.name,
          isUserSpace: true,
          timestamp: Date.now(),
          type: "space",
        })

        db.data.userSpaces[id] = [
          {
            id: id + PUBLIC_SPACE_ID,
            space: PUBLIC_SPACE_ID,
            timestamp: Date.now(),
            type: "user-space",
          },
          {
            id: id + user.name,
            space: user.name,
            timestamp: Date.now(),
            type: "user-space",
          },
        ]

        db.commit()

        return user
      }),
    getAll: publicProcedure.query(() => db.data.users),
  }),
  spaces: router({
    grantAccess: publicProcedure
      .input(
        z.object({
          spaceId: z.string(),
          toUserId: z.string(),
        }),
      )
      .mutation(async ({ input }) => {
        const userSpaces = db.data["userSpaces"][input.toUserId] || []

        userSpaces.push({
          id: Date.now().toString(),
          space: input.spaceId,
          timestamp: Date.now(),
          type: "user-space",
        })

        db.data["userSpaces"][input.toUserId] = userSpaces
        db.commit()
      }),
  }),
  apps: router({
    list: publicProcedure.query(() => apps),
    get: publicProcedure
      .input(z.object({ name: z.string() }))
      .query(({ input }) => apps.find((app) => app.name === input.name)),
  }),
})
