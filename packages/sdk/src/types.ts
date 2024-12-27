import { AppData, Space } from "@repo/data/models"
import React from "react"

export type Entry<D = unknown> = React.ComponentType<{
  db: Db<D>
  spaces: {
    active?: Space
    all: Space[]
    filtered: boolean
  }
}>

export interface App<D = unknown> {
  /**
   *  The Entrypoint for the app
   */
  Entry: Entry<D>
}

export interface Manifest {
  /**
   * The name of the app
   */
  name: string
}

type PromiseArray<T> = Promise<Array<T>>

export type DbRecord<T> = Pick<AppData, "id" | "space" | "timestamp"> & {
  data: T
}

export interface Db<T = unknown> {
  get: <O extends T = T>(key: string) => Promise<DbRecord<O> | undefined>
  update: <O extends T = T>(key: string, value: O) => Promise<DbRecord<O>>
  create: <O extends T = T>(value: O) => Promise<DbRecord<O>>
  delete: (key: string) => Promise<void>
  query: <O extends T = T>(query?: Partial<O>) => PromiseArray<DbRecord<O>>

  subscribe: <O extends T = T>(query?: Partial<O>) => PromiseArray<DbRecord<O>>
}
