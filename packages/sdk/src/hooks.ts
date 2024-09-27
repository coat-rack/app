import { DependencyList, useEffect, useState } from "react"

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

export function useRefresh() {
  const [key, setKey] = useState(Date.now())
  const refresh = () => setKey(Date.now())

  return [key, refresh] as const
}

type Observable<T> = {
  subscribe: (onChange: (val: T) => void) => void
}
export function useObservable<T extends any>(
  obs: Observable<T>,
  deps: DependencyList = [],
) {
  const [value, setValue] = useState<T>()

  useEffect(() => {
    obs.subscribe(setValue)
  }, deps)

  return value
}
