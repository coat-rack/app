# Coat Rack

## Development

Run `pnpm install` then `pnpm dev`, the development version runs on port 4000

## Running PWA Build

Since the intention of the application is to work offline, it's useful to be able to test this behaviour. Offline behavior can be tested using the preview command - this will build all of the catalog apps and run the main applications (`web` and `server`) in production mode.

> Note that during preview changes will not automatically be rebuilt. If you need to test your changes you will need to stop and restart the process

To run a production preview do the following:

> Before running the preview be sure to clear your application site data to avoid any funny side effects

1. Run `pnpm preview`
2. Visit `http://localhost:4000` to view `web`
3. Log into the app
4. (If you are testing offline support) Open the network panel in your browser and swap the network throttling to `Offline` then refresh the page, the app should still be working - you should also be able to load apps using the "preview" version of each application
5. (To clear your serviceworker cache) In your dev tools go to **Application > Storage** and check of all the options under the **Application** and **Storage** section and then click **Clear site data**

You can then enable offline in your network tab after the first load of the web app

## Creating a catalog app

Catalog apps are simply apps that are located in the `catalog` directory. The simplest way to create a new catalog app is by copying the `sample-app` and changing the name of the app to be whatever you'd like

> We should automate this at some point using `@coat-rack/create-app`, at the moment the generator can't be used since it uses "real" package versions and has a slightly diffeerent dev mode workflow

## Adding a new monorepo package

Packages can be created using the following command:

```sh
pnpm run generate workspace
```

You will thereafter be prompted to create either an `app` or `package` and can select as appropriate.

## Installing Apps

When working on the catalog the `dev-catalog` will host the root directory, this means that you can view the catalog directory apps using the `http://localhost:3005`. Each app can be "installed" via the `app-name/dist` directory

## Releasing

Releases are done using [`changesets`](https://github.com/changesets/changesets). The process for releasing consists of creating changesets as part of the normal dev workflow, and then creating a release which consists of one or more changesets.

### Creating Changesets

1. Make your changes/PR as normal.
2. When ready, create a new changesets using `pnpm changeset` that describes the given group of changes following the prompts for the selection of libraries and whether the release is a major/minor/patch

### Creating a Release

1. Once ready with a set of changes that should form part of a release, you can use `pnpm changeset version` to create a new version, following the prompts as needed
2. Lastly, create a PR with the changes. If this is merged, the `release` workflow will run which will:
  - Create a release for all relevant packages on GitHub
  - Publish appliccable packages to NPM

For more detailed information on how changesets work, take a look at the `changesets` documentation

### Pre-release Versions

`changesets` also has support for pre-release versions. These can be "entered" or "exited" by using `pnpm changeset pre enter <alpha|beta|etc.>` and then versioning as normal. The pre-release chain can be ended using `pnpm pre exit <alpha|beta|etc.>`
