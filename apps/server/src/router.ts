import { App, AppData, Push, Space, User } from "@repo/data/models"
import { z } from "zod"
import { DB, dbKeys } from "./db"
import { addToCatalog } from "./persistence/fs"
import { publicProcedure, router } from "./trpc"

const PUBLIC_SPACE_ID = "public"

export const seedDb = async (db: DB) => {
  const spaces: Space[] = [
    {
      type: "space",
      id: PUBLIC_SPACE_ID,
      timestamp: Date.now(),
      name: "public",
      spaceType: "shared",
      owner: "admin",
      users: ["admin"],
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

  const apps: App[] = [
    {
      id: "kitchen-sink",
      type: "app",
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

  const existingApps = await db.apps.getAll()
  if (!existingApps.length) {
    await db.apps.putItems(apps)
  }
}

const username = z.string().regex(/^[a-z]+$/)

/**
 * Tables whose data is not scoped by user access
 */
type NonScopedTable = (typeof nonScopedTables)[number]

const nonScopedTables = ["apps", "users"] as const satisfies (keyof DB)[]
const isNonScopedTable = (key: keyof DB): key is NonScopedTable =>
  (nonScopedTables as string[]).includes(key)

/**
 * Implements handling for https://rxdb.info/replication-http.html
 */
export const rxdbRouter = (db: DB) =>
  router({
    pull: publicProcedure
      .input(
        z.object({
          collection: z.enum(dbKeys),
          userId: z.string(),
          checkpoint: z.number().optional(),
          batchSize: z.number(),
        }),
      )
      .query(async ({ input }) => {
        const collection = input.collection
        const isNonScoped = isNonScopedTable(collection)

        if (isNonScoped) {
          const documents = await db[collection].getAll()
          return {
            documents,
            checkpoint: db[collection].getCheckpoint(),
          }
        }

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

        const appData = await db.appdata.getItems(
          input.checkpoint || 0,
          Infinity,
        )
        const documents = appData.filter(isUserItem)

        return {
          checkpoint: db.appdata.getCheckpoint(),
          documents,
        }
      }),

    push: publicProcedure
      .input(z.union([Push("spaces", Space), Push("appdata", AppData)]))
      .mutation(async ({ input }) => {
        const { conflicts } = await db[input.type].putItems(
          // Would be nice to not do this but I don't think the inference at this
          // point matters since we're already so generic
          input.changes as any,
        )

        const deletes = input.deletes.map((row) => ({
          ...row,
          isDeleted: true,
        }))
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

export const appRouter = (rootDir: string, db: DB) =>
  router({
    rxdb: rxdbRouter(db),
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
            throw new Error("Cannot grant access to a non-shared space")
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
      install: publicProcedure
        .input(z.string().url())
        .mutation(async ({ input }) => {
          const manifest = await addToCatalog(rootDir, new URL(input))
          const item = await db.apps.putItems([
            { type: "app", id: manifest.id, timestamp: Date.now() },
          ])
          return item
        }),
    }),
  })
