# Coat Rack

## Development

Run `pnpm install` then `pnpm dev`, the development version runs on port 4000

## Running PWA Build

Since the intention of the application is to work offline, it's useful to be able to test this behaviour. Offline behavior can be tested using the preview command - this will build all of the catalog apps and run the main applications (`web` and `server`) in production mode.

To run the preview do the following:

1. Run `pnpm preview`
2. Visit `http://localhost:4001` to view `web`
3. Log into the app
4. (If you are testing offline support) Open the network panel in your browser and swap the network throttling to `Offline` then refresh the page, the app should still be working
5. (To clear your serviceworker cache) In your dev tools go to **Application > Storage** and check of all the options under the **Application** and **Storage** section and then click **Clear site data**

You can then enable offline in your network tab after the first load of the web app

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
