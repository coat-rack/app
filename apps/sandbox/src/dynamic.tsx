import { usePromise } from "@coat-rack/core/async"
import { App, Manifest } from "@coat-rack/sdk"
import React from "react"
import ReactDOM from "react-dom"

// Need to figure out how to do this at the build level
window["React"] = React
window["ReactDOM"] = ReactDOM

const MANIFEST_FILE = "_app/manifest.json"
const INDEX_FILE = "_app/index.mjs"
export function resolveAppUrls(): [indexUrl: URL, manifestUrl: URL] {
  const baseUrl = new URL(window.location.toString())

  const manifestUrl = new URL(MANIFEST_FILE, baseUrl)
  const indexUrl = new URL(INDEX_FILE, baseUrl)

  return [indexUrl, manifestUrl]
}

type AppError = {
  type: "manifest" | "app"
  error: unknown
}

type AppResult = {
  app?: App
  manifest?: Manifest
}

type UseAppResult = [result: AppResult, error?: AppError]

export const useApp = (
  entryPointUrl?: URL,
  manifestUrl?: URL,
): UseAppResult => {
  const [app, appError] = usePromise(async () => {
    if (!entryPointUrl) {
      return undefined
    }

    return import(/* @vite-ignore */ entryPointUrl.toString())
  }, [entryPointUrl?.toString()])

  const [manifest, manifestError] = usePromise(async () => {
    if (!manifestUrl) {
      return undefined
    }

    const response = await fetch(manifestUrl)
    if (!response.ok) {
      throw `manifest is not ok: ${response.status}`
    }

    const result = await response.json()

    return result as Manifest
  }, [manifestUrl?.toString()])

  if (manifestError) {
    return [
      {},
      {
        type: "manifest",
        error: manifestError,
      },
    ]
  }

  if (appError) {
    return [
      {},
      {
        type: "app",
        error: appError,
      },
    ]
  }

  return [
    {
      app: app?.default as App | undefined,
      manifest,
    },
    undefined,
  ] as const
}
