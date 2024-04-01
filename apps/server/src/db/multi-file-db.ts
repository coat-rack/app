import { ensureDirSync, readJson, writeJson } from "fs-extra"
import path from "path"
import { isDefined } from "../array"
import { JSONFile } from "./json-file"
import { Async, Checkpoint, OperationResult, Table, TableRow } from "./types"

interface Meta<ID extends string> {
  index: Partial<Record<ID, Checkpoint>>
  deletes: Partial<Record<ID, Checkpoint>>
}

/**
 * A file-based table with an in-memory index that is persisted to disk when
 * changed
 */
export class MultiFileTable<ID extends string, T extends TableRow<ID>>
  implements Table<ID, T>
{
  private static readonly configDir = "config"
  private static readonly metaFile = "meta.json"
  private readonly meta: JSONFile<Meta<ID>>

  /**
   *
   * @param dbPath path to the directory to store records
   */
  constructor(private readonly dbPath: string) {
    ensureDirSync(path.join(dbPath, MultiFileTable.configDir))

    this.meta = new JSONFile<Meta<ID>>(
      path.join(dbPath, MultiFileTable.configDir, MultiFileTable.metaFile),
      {
        deletes: {},
        index: {},
      },
    )
  }

  private getIdPath(id: string) {
    return path.join(this.dbPath, id)
  }

  getCheckpoint(): number {
    return Date.now()
  }

  get(id: ID): Async<T | undefined> {
    const path = this.getIdPath(id)
    return readJson(path)
  }

  async getAll(): Promise<T[]> {
    const index = this.meta.get().index
    const paths = Object.keys(index) as ID[]

    const results = await Promise.all(paths.map((id) => this.get(id)))

    return results.filter(isDefined)
  }

  async getItems(from: number, to: number): Promise<T[]> {
    const index = this.meta.get().index

    const paths = (Object.entries(index) as [ID, number][])
      .filter(([_, checkpoint]) => from <= checkpoint && checkpoint <= to)
      .map(([id]) => id)

    const results = await Promise.all(paths.map((id) => this.get(id)))

    return results.filter(isDefined)
  }

  async putItem(item: T) {
    const path = this.getIdPath(item.id)
    return writeJson(path, item)
  }

  async putItems(items: T[]): Promise<OperationResult<T>> {
    const existingItems = await Promise.all(
      items.map((item) => this.get(item.id)),
    )
    const data = existingItems.filter(isDefined)

    const conflicts: T[] = []
    const entries: T[] = []

    const index = this.meta.get().index

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const foundIndex = data.findIndex((i) => i.id === item.id)

      const exists = foundIndex > 0

      if (exists) {
        const existing = data[foundIndex]
        if (existing.timestamp <= item.timestamp) {
          entries.push(item)
          index[item.id] = item.timestamp
        } else {
          conflicts.push(existing)
        }
      } else {
        entries.push(item)
      }
    }

    this.meta.setField("index", index)

    await Promise.all(entries.map((e) => this.putItem(e)))

    return { conflicts }
  }
}
