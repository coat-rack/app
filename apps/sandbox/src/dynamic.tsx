import { App, Manifest } from "@repo/sdk"
import React from "react"
import ReactDOM from "react-dom"
import { usePromise } from "./async"

// Need to figure out how to do this at the build level
window["React"] = React
window["ReactDOM"] = ReactDOM

type AppError = { type: "manifest" | "app"; error: unknown }
type AppResult = { app?: App; manifest?: Manifest }
type UseAppResult = [result: AppResult, error?: AppError]
export const useApp = (
  entryPointUrl?: string,
  manifestUrl?: string,
): UseAppResult => {
  const [app, appError] = usePromise(async () => {
    if (!entryPointUrl) {
      return undefined
    }

    return import(entryPointUrl)
  }, [entryPointUrl])

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
  })

  if (manifestError) {
    return [{}, { type: "manifest", error: manifestError }]
  }

  if (appError) {
    return [{}, { type: "app", error: appError }]
  }

  return [
    { app: app?.default as App | undefined, manifest },
    undefined,
  ] as const
}
