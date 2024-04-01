import { z } from "zod"
import { publicProcedure, router } from "./trpc"

import { AppData, Push, Schema, Space, User } from "@repo/data/models"
import { MultiFileTable } from "./db/multi-file-db"
import { Table } from "./db/types"

/**
 * Need to make this somehow managable and installable from the datbase. Not
 * doing this right now as it will add some complexity as we have not yet
 * determined how we will manage installations more generally
 **/
interface App {
  id: string
  url: string
}

const apps: App[] = [
  {
    id: "sample-app",
    url: "http://localhost:3000/catalog/sample-app/dist/index.mjs",
  },

  {
    id: "tasks",
    url: "http://localhost:3000/catalog/tasks/dist/index.mjs",
  },
]

type DB = {
  [K in keyof Schema]: Table<string, Schema[K]>
}

const PUBLIC_SPACE_ID = "public"

const db: DB = {
  spaces: new MultiFileTable("./database/spaces"),
  users: new MultiFileTable("./database/users"),
  appData: new MultiFileTable("./database/appData"),
}

const init = async () => {
  const spaces: Space[] = [
    {
      type: "space",
      id: PUBLIC_SPACE_ID,
      timestamp: Date.now(),
      name: "public",
      spaceType: "shared",
      owner: "admin",
      users: [],
    },
    {
      // Each user has a space defined for them
      type: "space",
      timestamp: Date.now(),
      id: "admin",
      name: "admin",
      owner: "admin",
      spaceType: "user",
      users: [],
    },
  ]

  const users: User[] = [
    {
      id: "admin",
      name: "admin",
      type: "user",
      timestamp: Date.now(),
    },
  ]

  const existingUsers = await db.users.getAll()
  if (!existingUsers.length) {
    await db.users.putItems(users)
  }

  const existingSpaces = await db.spaces.getAll()
  if (!existingSpaces.length) {
    await db.spaces.putItems(spaces)
  }
}

init()

const username = z.string().regex(/^[a-z]+$/)

/**
 * Implements handling for https://rxdb.info/replication-http.html
 */
export const rxdbRouter = router({
  pull: publicProcedure
    .input(
      z.object({
        collection: z.enum(["spaces", "appData", "users"]),
        userId: z.string(),
        checkpoint: z.number().optional(),
        batchSize: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const allSpaces = await db.spaces.getItems(0, Infinity)
      const userSpaces = allSpaces.filter(
        (space) =>
          space.owner === input.userId || space.users?.includes(input.userId),
      )

      if (input.collection === "spaces") {
        return {
          checkpoint: db.spaces.getCheckpoint(),
          documents: userSpaces,
        }
      }

      const userSpaceIds = userSpaces.map((us) => us.id)
      const isUserItem = (item: AppData) => userSpaceIds.includes(item.space)

      const appData = await db.appData.getItems(input.checkpoint || 0, Infinity)
      const documents = appData.filter(isUserItem)

      return {
        checkpoint: db.appData.getCheckpoint(),
        documents,
      }
    }),

  push: publicProcedure
    .input(
      z.union([
        Push("spaces", Space),
        Push("appData", AppData),
        Push("users", User),
      ]),
    )
    .mutation(async ({ input }) => {
      const { conflicts } = await db[input.type].putItems(
        // Would be nice to not do this but I don't think the inference at this
        // point matters since we're already so generic
        input.changes as any,
      )

      const deletes = input.deletes.map((row) => ({ ...row, isDeleted: true }))
      await db[input.type].putItems(deletes as any)

      console.log("push", {
        input,
      })

      // Should return any conflicting records
      return conflicts
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
      .query(async ({ input }) => {
        const users = await db.users.getAll()
        console.log({ users })
        return users.find((user) => user.name === input.name)
      }),
    create: publicProcedure
      .input(
        z.object({
          name: username,
        }),
      )
      .mutation(async ({ input }) => {
        const id = input.name.toLowerCase()

        const user: User = {
          id,
          name: id,
          timestamp: Date.now(),
          type: "user",
        }

        const users = await db.users.getItems(0, Infinity)
        const existing = users.find((u) => u.id === id)
        if (existing) {
          return existing
        }

        await db.users.putItems([user])
        await db.spaces.putItems([
          {
            type: "space",
            id: user.id,
            name: user.name,
            owner: user.id,
            spaceType: "user",
            timestamp: Date.now(),
          },
        ])

        const publicSpace = await db.spaces.get(PUBLIC_SPACE_ID)
        if (publicSpace && publicSpace.spaceType === "shared") {
          await db.spaces.putItems([
            {
              ...publicSpace,
              users: [...(publicSpace.users || []), user.id],
            },
          ])
        }

        return user
      }),
    getAll: publicProcedure.query(() => db.users.getItems(0, Infinity)),
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
        const foundSpace = await db.spaces.get(input.spaceId)
        if (!foundSpace) {
          throw new Error("Space does not exist")
        }

        if (foundSpace.spaceType !== "shared") {
          throw new Error("Cannot grant access toa  non-shared space")
        }

        await db.spaces.putItems([
          {
            ...foundSpace,
            users: [...(foundSpace.users || []), input.toUserId],
          },
        ])
      }),
  }),
  apps: router({
    list: publicProcedure.query(() => apps),
    get: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(({ input }) => apps.find((app) => app.id === input.id)),
  }),
})
