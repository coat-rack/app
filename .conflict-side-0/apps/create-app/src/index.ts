#!/usr/bin/env node
import { Plop, run } from "plop"

import { join } from "path"
import { importMetaDir } from "./resolution.js"

const dir = importMetaDir(import.meta.url)

Plop.prepare(
  {
    configPath: join(dir, "plopfile.js"),
  },
  (env) => Plop.execute(env, (env, arg) => run(env, arg, false)),
)
