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
type Query = {}

export interface Db<T> {
  get: (type: string, key: string) => Promise<T>
  upsert: (type: string, key: string, value: T) => Promise<T>
  delete: (type: string, key: string) => Promise<void>
  query: (type: string, query?: Query) => PromiseArray<T>
}
