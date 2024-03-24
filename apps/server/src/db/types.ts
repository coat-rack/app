export type Async<T> = T | Promise<T>
export type AsyncArray<T> = Array<T> | Promise<Array<T>>

export type Checkpoint = number

export interface DB<ID, TSchema> {
  getItems<TType extends keyof TSchema>(
    type: TSchema[TType] extends Array<any> ? TType : never,
    from: Checkpoint,
    to: Checkpoint,
  ): Async<TSchema[TType] extends Array<any> ? TSchema[TType] : never>

  //   putItems<TType extends keyof Table<TSchema>>(
  //     type: TType,
  //     items: Table<TSchema>[TType],
  //   ): Async<Table<TSchema>[TType]>

  //   deleteItems<TType extends keyof Table<TSchema>>(
  //     type: TType,
  //     ids: ID[],
  //   ): Async<void>

  //   getDeletes<TType extends keyof Table<TSchema>>(type: TType): AsyncArray<ID>
}
