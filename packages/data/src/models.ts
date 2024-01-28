import { z } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

export type Row = z.infer<typeof Row>
export const Row = z.object({
  id: z.string().max(100),
  timestamp: z.number(),
  /**
   * Deleted field - named such since RxDB/JS reserves the good names
   */
  dltd: z.boolean().optional(),
})

export type Todo = z.infer<typeof Todo>
export const Todo = Row.extend({
  id: z.string().max(100),
  done: z.boolean(),
  title: z.string(),
})

export const TodoJsonSchema = zodToJsonSchema(Todo)

export const Schema = z.object({
  todos: z.array(Todo),
})

export type Schema = z.infer<typeof Schema>
