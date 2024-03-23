import { Schema } from "@repo/data/models"
import React from "react"

export interface App {
  /**
   * Name of the app
   */
  name: string
  /**
   *  The Entrypoint for the app
   */
  Entry: React.ComponentType
}

type PromiseArray<T> = Promise<Array<T>>
type CollectionType = keyof Schema

export type RpcMessageBase = {
  requestId: string
}

export type RpcRequest<C extends CollectionType> =
  | RpcGetRequest<C>
  | RpcUpsertRequest<C>
  | RpcUpsertRequest<C>
  | RpcDeleteRequest<C>
  | RpcQueryRequest<C>

// todo: is there a way to constrain the 'op' to keyof Db?
export type RpcGetRequest<C extends CollectionType> = RpcMessageBase & {
  op: "get"
  args: [C, string]
}

export type RpcUpsertRequest<C extends CollectionType> = RpcMessageBase & {
  op: "upsert"
  args: [C, Schema[C][0]]
}

export type RpcDeleteRequest<C extends CollectionType> = RpcMessageBase & {
  op: "delete"
  args: [C, string]
}

export type RpcQueryRequest<C extends CollectionType> = RpcMessageBase & {
  op: "query"
  args: [C, Partial<Schema[C][0]>]
}

export type RpcResponse<T> = RpcMessageBase & {
  value: T
}

export interface Db {
  get: <C extends keyof Schema>(type: C, key: string) => Promise<Schema[C]>
  upsert: <C extends keyof Schema>(
    type: C,
    value: Schema[C][0],
  ) => Promise<Schema[C]>
  delete: <C extends keyof Schema>(type: C, key: string) => Promise<void>
  query: <C extends keyof Schema>(
    type: C,
    query?: Partial<Schema[C][0]>,
  ) => PromiseArray<Schema[C]>
}
