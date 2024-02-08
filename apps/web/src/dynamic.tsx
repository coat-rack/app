import React from "react"
import ReactDOM from "react-dom"
import { usePromise } from "./async"

// Need to figure out how to do this at the build level
window["React"] = React
window["ReactDOM"] = ReactDOM

// Want to think about where to put this, might need some kind of tiny library
// that app developers can import this from. May be generally useful to create
// an "SDK" of sorts with the things that we would like to make accessible to
// user-defined "Apps"
interface App {
  entry: React.ComponentType
  name: string
  schemas: []
}

export const useApp = (url: string) => {
  const dynamic = usePromise(() => import(url))
  return dynamic?.default as App | undefined
}
