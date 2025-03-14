import { existsSync } from "fs"
import { ensureDirSync, readJsonSync, writeFileSync } from "fs-extra"
import path from "path"

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
   * @param beforeSave method to transform input on save
   */
  constructor(
    private readonly path: string,
    initial: F,
    private readonly beforeSave = (data: F) => data,
  ) {
    this.file = this.load(initial)
  }

  public set(data: F) {
    this.file = data
    this.persist()
  }

  public setField<K extends keyof F>(key: K, value: F[K]) {
    this.file[key] = value
    this.persist()
  }

  public get() {
    return this.file
  }

  private persist() {
    this.file = this.beforeSave(this.file)

    ensureDirSync(path.dirname(this.path))
    writeFileSync(this.path, JSON.stringify(this.file, null, 2))
  }

  private read(): F {
    const file = readJsonSync(this.path)
    return file
  }

  private load(initial: F): F {
    if (!existsSync(this.path)) {
      this.file = initial

      ensureDirSync(path.dirname(this.path))
      this.persist()
    }

    const current = this.read()

    return current
  }
}
