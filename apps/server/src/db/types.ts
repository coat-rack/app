export type Async<T> = T | Promise<T>

export type Checkpoint = number

export interface TableRow<ID> {
  id: ID
  timestamp: number
  isDeleted?: boolean
}

export interface OperationResult<T> {
  conflicts?: T[]
}

export interface Table<ID, T extends TableRow<ID>> {
  getCheckpoint(): Checkpoint

  get(id: ID): Async<T | undefined>

  getAll(): Async<T[]>

  getItems(from: Checkpoint, to: Checkpoint): Async<T[]>

  putItems(items: T[]): Async<OperationResult<T>>
}
