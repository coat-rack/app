import { z } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

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

export type Todo = z.infer<typeof Todo>
export const Todo = RowWithSpace("todo").extend({
  done: z.boolean(),
  title: z.string(),
})

export type Note = z.infer<typeof Note>
export const Note = RowWithSpace("note").extend({
  title: z.string(),
  content: z.string(),
})

export const TodoJsonSchema = zodToJsonSchema(Todo)

export const Schema = z.object({
  todos: z.array(Todo),
  notes: z.array(Note),
})

export type Schema = z.infer<typeof Schema>

export type User = z.infer<typeof User>
export const User = Row("user").extend({
  name: z.string(),
})

export type Space = z.infer<typeof Space>
export const Space = Row("space").extend({
  name: z.string(),
  isUserSpace: z.boolean(),
})

export const KeyValue = z.object({
  id: z.string().max(100),
  value: z.string().optional(),
})
export type KeyValue = z.infer<typeof KeyValue>

export type SpaceRelation = z.infer<typeof SpaceRelation>
export const SpaceRelation = RowWithSpace("user-space")

export type UserSpaces = z.infer<typeof UserSpaces>
export const UserSpaces = z.record(z.array(SpaceRelation))
