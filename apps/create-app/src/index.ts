#!/usr/bin/env node
import { join } from "path"
import { Plop, run } from "plop"

Plop.prepare(
  {
    configPath: join(__dirname, "plopfile.mjs"),
  },
  (env) => Plop.execute(env, (env, arg) => run(env, arg, false)),
)
