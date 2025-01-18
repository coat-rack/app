import type { ComponentType } from "react"

export interface AppContext<T = unknown> {
  db: Db<T>
  activeSpace?: Space
  spaces: Space[]
}

export interface Space {
  id: string
  name: string
  owner: string
  spaceType: "user" | "shared"
  color: string
}

export interface Entry<TData = unknown> {
  context: AppContext<TData>
}

export interface App<TData = unknown> {
  /**
   *  The Entrypoint for the app
   */
  Entry: ComponentType<Entry<TData>>
}

export interface Manifest {
  /**
   * The name of the app
   */
  name: string
}

type PromiseArray<T> = Promise<Array<T>>

export interface DbRecord<T> {
  id: string
  timestamp: number
  space: string
  data: T
}

export interface Db<T = unknown> {
  get: <O extends T = T>(key: string) => Promise<DbRecord<O> | undefined>

  update: <O extends T = T>(
    key: string,
    space: string,
    value: O,
  ) => Promise<DbRecord<O>>

  create: <O extends T = T>(value: O) => Promise<DbRecord<O>>

  delete: (key: string) => Promise<void>

  query: <O extends T = T>(query?: Partial<O>) => PromiseArray<DbRecord<O>>

  subscribe: <O extends T = T>(query?: Partial<O>) => PromiseArray<DbRecord<O>>
}
