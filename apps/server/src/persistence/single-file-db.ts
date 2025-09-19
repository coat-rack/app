import { JSONFile } from "./json-file"
import { Async, Checkpoint, OperationResult, Table, TableRow } from "./types"

interface File<TData> {
  data: TData[]
  checkpoint: Checkpoint
}

export class SingleFileTable<ID, T extends TableRow<ID>>
  implements Table<ID, T>
{
  private readonly file: JSONFile<File<T>>

  /**
   * @param dbPath path to the database JSON file
   * @param initial initial data to be used if DB file is not found
   */
  constructor(dbPath: string, initial: T[] = []) {
    this.file = new JSONFile<File<T>>(
      dbPath,
      {
        checkpoint: Date.now(),
        data: initial,
      },
      (file) => {
        file.checkpoint = this.getCheckpoint()
        return file
      },
    )
  }

  public getCheckpoint() {
    return Date.now()
  }

  get(id: ID): Async<T | undefined> {
    const data = this.file.get().data
    return data.find((row) => row.id === id)
  }

  getAll(): Async<T[]> {
    const data = this.file.get().data
    return data
  }

  getItems(from: number, to: number): Async<T[]> {
    const data = this.file.get().data
    return data.filter((row) => row.timestamp >= from && row.timestamp <= to)
  }

  putItems(items: T[]): Async<OperationResult<T>> {
    const conflicts: T[] = []

    const data = this.file.get().data

    for (let index = 0; index < items.length; index++) {
      const item = items[index]
      const foundIndex = data.findIndex((i) => i.id === item.id)

      const exists = foundIndex > 0

      if (exists) {
        const existing = data[foundIndex]
        if (existing.timestamp <= item.timestamp) {
          data[foundIndex] = item
        } else {
          conflicts.push(existing)
        }
      } else {
        data.push(item)
      }
    }

    this.file.setField("data", data)
    return { conflicts }
  }

  /**
   * Removes entry from table completely
   */
  async destroy(id: ID) {
    const newData = this.file.get().data.filter((d) => d.id !== id)
    this.file.setField("data", newData)
  }
}
