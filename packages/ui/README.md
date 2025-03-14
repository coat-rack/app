# UI

## Generating Components

Initial component generation is done using the [shadcn/ui library](https://ui.shadcn.com)

Components can be generated from the `ui` package root directory with the relevant pnpm command:

```sh
pnpm dlx shadcn@latest add <component name>
```

You may need to update some imports on the component (i.e. src/lib/utils). If the component needs to be exported from the package it should be added to the `package.json/exports` field.

You can edit the component however you'd like after that.
