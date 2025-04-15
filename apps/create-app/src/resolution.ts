import { dirname } from "path/posix"
import { fileURLToPath } from "url"

export function importMetaDir(importMetaUrl: string) {
  return dirname(fileURLToPath(importMetaUrl))
}
