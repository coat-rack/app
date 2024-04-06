import { AppData, KeyValue, Space } from "@repo/data/models"
import { PrimaryKey, RxJsonSchema } from "rxdb"
import { type ZodType } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

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

export const metaSchema = inferRxJsonSchemaFromZod(KeyValue, 0)
export const spaceSchema = inferRxJsonSchemaFromZod(Space, 0)
export const appDataSchema = inferRxJsonSchemaFromZod(AppData, 0)
