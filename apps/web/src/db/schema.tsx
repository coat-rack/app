import { Note, Space, Todo } from "@repo/data/models"
import { PrimaryKey, RxJsonSchema } from "rxdb"
import { ZodType } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

export interface KeyValue {
  id: string
  value?: string
}

function inferRxJsonSchemaFromZod<TSchema>(
  type: ZodType<TSchema>,
  version: number,
): RxJsonSchema<TSchema> {
  let schema = zodToJsonSchema(type) as RxJsonSchema<TSchema>
  return {
    type: "object",
    version,
    primaryKey: "id" as PrimaryKey<TSchema>,
    required: schema.required,
    properties: schema.properties,
  }
}

export const todoSchema = inferRxJsonSchemaFromZod(Todo, 0)

export const metaSchema: RxJsonSchema<KeyValue> = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      maxLength: 100,
      type: "string",
    },
    value: {
      type: "string",
    },
  },
  required: ["id"],
}

export const noteSchema = inferRxJsonSchemaFromZod(Note, 0)
export const spaceSchema = inferRxJsonSchemaFromZod(
  Space,
  0,
)
