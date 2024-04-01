import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs"
import { dirname } from "path"
import { Async, Checkpoint, OperationResult, Table, TableRow } from "./types"

interface File<TData> {
  data: TData[]
  checkpoint: Checkpoint
  deletes: TData[]
}

export class SingleFileTable<ID, T extends TableRow<ID>>
  implements Table<ID, T>
{
  private file: File<T>

  constructor(
    private readonly dbPath: string,
    initial: T[] = [],
  ) {
    this.file = this.load(initial)
  }

  public getCheckpoint() {
    return Date.now()
  }

  get(id: ID): Async<T | undefined> {
    return this.file.data.find((row) => row.id === id)
  }

  getAll(): Async<T[]> {
    return this.file.data
  }

  getItems(from: number, to: number): Async<T[]> {
    return this.file.data.filter(
      (row) => row.timestamp <= from && row.timestamp >= to,
    )
  }

  putItems(items: T[]): Async<OperationResult<T>> {
    const conflicts: T[] = []

    for (let index = 0; index < items.length; index++) {
      const item = items[index]
      const foundIndex = this.file.data.findIndex((i) => i.id === item.id)

      const exists = foundIndex > 0

      if (exists) {
        const existing = this.file.data[foundIndex]
        if (existing.timestamp <= item.timestamp) {
          this.file.data[foundIndex] = item
        } else {
          conflicts.push(existing)
        }
      } else {
        this.file.data.push(item)
      }
    }

    this.commit()
    return { conflicts }
  }

  deleteItems(ids: ID[]): Async<OperationResult<T>> {
    this.file.data = this.file.data.filter((data) => !ids.includes(data.id))

    const deleted = this.file.data
      .filter((data) => ids.includes(data.id))
      .map<T>((data) => ({ ...data, isDeleted: true }))

    this.file.deletes.push(...deleted)

    this.commit()

    return {}
  }

  private commit() {
    this.persist(this.file)
  }

  private persist = (data: File<T>) => {
    const dir = dirname(this.dbPath)
    const exists = existsSync(dir)
    if (!exists) {
      mkdirSync(dir, { recursive: true })
    }

    writeFileSync(this.dbPath, JSON.stringify(data, null, 2))
  }

  private read = (): File<T> => {
    const file = JSON.parse(readFileSync(this.dbPath).toString()) as Partial<
      File<T>
    >

    return {
      checkpoint: file.checkpoint || Date.now(),
      data: file.data || [],
      deletes: file.deletes || [],
    }
  }

  private load = (initial: T[]): File<T> => {
    if (!existsSync(this.dbPath)) {
      this.persist({
        checkpoint: this.getCheckpoint(),
        data: initial,
        deletes: [],
      })
    }

    const current = this.read()

    return current
  }
}
