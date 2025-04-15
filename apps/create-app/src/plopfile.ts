import { readFileSync } from "fs"
import { join } from "path"
import { NodePlopAPI } from "plop"
import { cwd } from "process"
import { importMetaDir } from "./resolution.js"

const catalogAppFiles = [
  "src/index.tsx",
  "src/styles.css",
  "package.json",
  "tsconfig.json",
  "vite.config.ts",
  "tailwind.config.ts",
  "postcss.config.js",
  "public/manifest.json",
]

export default function generator(plop: NodePlopAPI): void {
  const dir = importMetaDir(import.meta.url)
  const pkg = JSON.parse(readFileSync(join(dir, "../package.json"), "utf-8"))

  plop.setGenerator("app", {
    description: "Create a new Coat Rack app",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the app?",
      },
    ],

    actions: () =>
      catalogAppFiles.map((file) => ({
        type: "add",
        path: `${cwd()}/{{ kebabCase name }}/${file}`,
        templateFile: `../generators/catalog-app/${file}.hbs`,
        data: {
          timestamp: Date.now(),
          version: pkg.version,
        },
      })),
  })
}
