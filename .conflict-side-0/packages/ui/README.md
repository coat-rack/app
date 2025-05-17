# UI

## Generating Components

Initial component generation is done using the [shadcn/ul library](https://ui.shadcn.com)

Components can be generated from the `ui` package root directory with the relevant pnpm command:

```sh
pnpm dlx shadcn-ui@latest add <component name>
```

Since we are using a bit of a custom layout, you will then need to move the component from the `ui` directory into the `components` directory and then the util imports need to be corrected. If the component needs to be exported from the package it should be added to the `package.json/exports` field
