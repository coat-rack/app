import { DependencyList, useEffect, useState } from "react"

// TODO: this can probably go in a lib somewhere
export const usePromise = <T>(
  task: () => Promise<T>,
  deps: DependencyList = [],
) => {
  const [value, setValue] = useState<T>()

  useEffect(() => {
    task().then(setValue)
  }, deps)

  return value
}
