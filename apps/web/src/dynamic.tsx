import { App } from "@repo/sdk"
import { usePromise } from "@repo/sdk/hooks"
import React from "react"
import ReactDOM from "react-dom"

// Need to figure out how to do this at the build level
window["React"] = React
window["ReactDOM"] = ReactDOM

export const useApp = (url?: string) => {
  const [dynamic] = usePromise(async () => {
    if (!url) {
      return undefined
    }

    return import(url)
  }, [url])

  return dynamic?.default as App | undefined
}
