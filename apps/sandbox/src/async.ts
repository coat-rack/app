import { DependencyList, useEffect, useState } from "react"

// TODO: this can probably go in a lib somewhere
export const usePromise = <T>(
  task: () => Promise<T>,
  deps: DependencyList = [],
) => {
  const [value, setValue] = useState<T>()
  const [error, setError] = useState<unknown>()

  useEffect(() => {
    task().then(setValue).catch(setError)
  }, deps)

  return [value, error] as const
}
