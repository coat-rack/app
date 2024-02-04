import { Note, Space, Todo } from "@repo/data/models"
import { RxJsonSchema } from "rxdb"

export interface KeyValue {
  id: string
  value?: string
}

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

export const todoSchema: RxJsonSchema<Todo> = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    space: {
      type: "string",
    },
    type: {
      type: "string",
    },
    timestamp: {
      type: "number",
    },
    id: {
      // Primary key requires a max length
      maxLength: 100,
      type: "string",
    },
    isDeleted: {
      type: "boolean",
    },
    title: {
      type: "string",
    },
    done: {
      type: "boolean",
    },
  },
  required: ["id", "title", "done", "type", "space"],
}

export const noteSchema: RxJsonSchema<Note> = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    space: {
      type: "string",
    },
    type: {
      type: "string",
    },
    timestamp: {
      type: "number",
    },
    id: {
      // Primary key requires a max length
      maxLength: 100,
      type: "string",
    },
    isDeleted: {
      type: "boolean",
    },
    title: {
      type: "string",
    },
    content: {
      type: "string",
    },
  },
  required: ["id", "title", "type", "space", "content"],
}

export const spaceSchema: RxJsonSchema<Space> = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    type: {
      type: "string",
    },
    timestamp: {
      type: "number",
    },
    id: {
      // Primary key requires a max length
      maxLength: 100,
      type: "string",
    },
    isDeleted: {
      type: "boolean",
    },
    isUserSpace: {
      type: "boolean",
    },
    name: {
      type: "string",
    },
  },
  required: ["type", "timestamp", "id", "name"],
}
