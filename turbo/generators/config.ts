import type { PlopTypes } from "@turbo/gen"

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

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("catalog-app", {
    description: "Create a new preconfigured app in the base catalog",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the app?",
      },
    ],

    actions: catalogAppFiles.map((file) => ({
      type: "add",
      path: `catalog/{{ kebabCase name }}/${file}`,
      templateFile: `catalog-app/${file}.hbs`,
      data: {
        timestamp: Date.now(),
        version: "0.0.0",
      },
    })),
  })
}
