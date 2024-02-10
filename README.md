# Coat Rack

## Development

Run `pnpm install` then `pnpm dev`

## Creating a catalog app

While apps are intented to be installable, we also include some predefined apps in the catalog. Adding a new app in the catalog can be done using the generator which can be run from the top-level of the project:

```sh
pnpm run generate catalog-app
```

Thereafter the app will be created in the relevant directory. You can then install the app or use it in your installation as required

## Adding a new monorepo package

Packages can be created using the following command:

```sh
pnpm run generate workspace
```

You will thereafter be prompted to create either an `app` or `package` and can select as appropriate.
