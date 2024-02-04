import { z } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

export const Row = <T extends string>(type: T) =>
  z.object({
    type: z.enum([type]),
    id: z.string().max(100),
    timestamp: z.number(),
    isDeleted: z.boolean().optional(),
    space: z.string(),
  })

export type Todo = z.infer<typeof Todo>
export const Todo = Row("todo").extend({
  done: z.boolean(),
  title: z.string(),
})

export type Note = z.infer<typeof Note>
export const Note = Row("note").extend({
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
export const User = z.object({
  id: z.string(),
  name: z.string(),
})

export type Space = z.infer<typeof Space>
export const Space = z.object({
  id: z.string(),
  name: z.string(),
  isUserSpace: z.boolean(),
})

export type UserSpaces = z.infer<typeof UserSpaces>
export const UserSpaces = z.record(z.array(z.string()))
