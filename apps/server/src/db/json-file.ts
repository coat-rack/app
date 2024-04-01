import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs"
import { dirname } from "path"

/**
 * A simple abstraction over a JSON file that reads once and then
 * takes ownership of a record. Will be persisted when changes are made
 *
 * Reads will be done from the in-memory file representation
 */
export class JSONFile<F> {
  private file: F

  /**
   * @param path path to the file to persist
   * @param initial initial data to be used if DB file is not found
   */
  constructor(
    private readonly path: string,
    initial: F,
  ) {
    this.file = this.load(initial)
  }

  public set(data: F) {
    this.file = data
    this.persist(this.file)
  }

  public setField<K extends keyof F>(key: K, value: F[K]) {
    this.file[key] = value
    this.persist(this.file)
  }

  public get() {
    return this.file
  }

  private persist(data: F) {
    const dir = dirname(this.path)
    const exists = existsSync(dir)
    if (!exists) {
      mkdirSync(dir, { recursive: true })
    }

    writeFileSync(this.path, JSON.stringify(data, null, 2))
  }

  private read(): F {
    const file = JSON.parse(readFileSync(this.path).toString()) as F
    return file
  }

  private load(initial: F): F {
    if (!existsSync(this.path)) {
      this.persist(initial)
    }

    const current = this.read()

    return current
  }
}
