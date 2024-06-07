import { AppData } from "@repo/data/models"
import React from "react"

export interface App {
  /**
   *  The Entrypoint for the app
   */
  Entry: React.ComponentType<{ db: Db }>
}

export interface Manifest {
  /**
   * The name of the app
   */
  name: string
}

type PromiseArray<T> = Promise<Array<T>>

export type Record<T> = Pick<AppData, "id" | "data"> & {
  data: T
}

export interface Db<T = unknown> {
  get: <O extends T>(key: string) => Promise<Record<O>>
  update: <O extends T>(key: string, value: O) => Promise<Record<O>>
  create: <O extends T>(value: O) => Promise<Record<O>>
  delete: (key: string) => Promise<void>
  query: <O extends T>(query?: Partial<O>) => PromiseArray<Record<O>>
}
