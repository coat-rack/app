import { z } from "zod"

export const Row = <T extends string>(type: T) =>
  z.object({
    type: z.enum([type]),
    id: z.string().max(100),
    timestamp: z.number(),
    isDeleted: z.boolean().optional(),
  })

export const RowWithSpace = <T extends string>(type: T) =>
  Row(type).extend({
    space: z.string(),
  })

export type User = z.infer<typeof User>
export const User = Row("user").extend({
  name: z.string(),
})

export type Space = z.infer<typeof Space>
export const Space = Row("space").extend({
  name: z.string(),
  owner: z.string(),

  /**
   * A space can either belong to a single user or be shared between multiple
   * users
   */
  spaceType: z.enum(["user", "shared"]),

  /**
   * For a `user` space this should always be an empty array. This
   * representation is simplified due to RxDB having some issues when using a
   * complex union type
   */
  users: z.string().array().optional(),
})

export const KeyValue = z.object({
  id: z.string().max(100),
  value: z.string().optional(),
})
export type KeyValue = z.infer<typeof KeyValue>

export type AppData = z.infer<typeof AppData>
export const AppData = RowWithSpace("app-data").extend({
  app: z.string(),
  data: z.any(),
})

export type App = z.infer<typeof App>
export const App = Row("app").extend({
  url: z.string(),
})

export type Schema = z.infer<typeof Schema>
export const Schema = z.object({
  spaces: Space,
  users: User,
  appdata: AppData,
  apps: App,
})

export type Push<T extends keyof Schema, S extends Schema[T]> = z.infer<
  ReturnType<typeof Push<T, S>>
>
export const Push = <T extends keyof Schema, S extends Schema[T]>(
  type: T,
  Schema: z.Schema<S>,
) =>
  z.object({
    type: z.literal(type),
    changes: Schema.array(),
    deletes: Schema.array(),
  })
