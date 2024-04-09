import React from "react"

export interface App {
  /**
   * Name of the app
   */
  name: string
  /**
   *  The Entrypoint for the app
   */
  Entry: React.ComponentType<{ db: Db }>
}

type PromiseArray<T> = Promise<Array<T>>

export type RpcMessage = {
  requestId: string
}

// LDAM: do we want to export this? it's more of an internal detail
export type RpcRequest<T> =
  | RpcGetRequest
  | RpcUpsertRequest<T>
  | RpcDeleteRequest
  | RpcQueryRequest<T>

type RpcOperation<O extends keyof Db> = {
  op: O
}

export type RpcGetRequest = RpcOperation<"get"> &
  RpcMessage & {
    op: "get"
    args: [string]
  }

export type RpcUpsertRequest<T> = RpcOperation<"upsert"> &
  RpcMessage & {
    op: "upsert"
    args: [string, T]
  }

export type RpcDeleteRequest = RpcOperation<"delete"> &
  RpcMessage & {
    op: "delete"
    args: [string]
  }

export type RpcQueryRequest<T> = RpcOperation<"query"> &
  RpcMessage & {
    op: "query"
    args: [T]
  }

export type RpcResponse<T> = RpcMessage & {
  value?: T
}

export interface Db {
  get: <T>(key: string) => Promise<T>
  upsert: <T>(
    key: string | null | undefined,
    value: T,
  ) => Promise<{ key: string; data: T }>
  delete: (key: string) => Promise<void>
  query: <T>(query?: Partial<T>) => PromiseArray<T>
}
