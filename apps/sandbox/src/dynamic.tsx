import { App, Manifest } from "@repo/sdk"
import React from "react"
import ReactDOM from "react-dom"
import { usePromise } from "./async"

// Need to figure out how to do this at the build level
window["React"] = React
window["ReactDOM"] = ReactDOM

type UseAppError = { type: "manifest" | "app"; error: unknown }

export const useApp = (
  entryPointUrl?: string,
  manifestUrl?: string,
): [App | undefined, Manifest | undefined, UseAppError | undefined] => {
  const [dynamicApp, errorApp] = usePromise(async () => {
    if (!entryPointUrl) {
      return undefined
    }

    return import(entryPointUrl)
  }, [entryPointUrl])

  const [manifest, errorManifest] = usePromise(async () => {
    if (!manifestUrl) {
      return undefined
    }

    return (await fetch(manifestUrl)).json()
  })

  if (errorManifest) {
    return [undefined, undefined, { type: "manifest", error: errorManifest }]
  }

  if (errorApp) {
    return [undefined, undefined, { type: "app", error: errorApp }]
  }

  return [
    dynamicApp?.default as App | undefined,
    manifest?.default as Manifest | undefined,
    undefined,
  ] as const
}
