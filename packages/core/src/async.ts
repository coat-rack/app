import { DependencyList, useEffect, useState } from "react"
import { Observable } from "rxjs"

export const usePromise = <T>(
  task: () => Promise<T>,
  deps: DependencyList = [],
): [value?: T, error?: unknown] => {
  const [value, setValue] = useState<T>()
  const [error, setError] = useState<unknown>()

  useEffect(() => {
    task().then(setValue).catch(setError)
  }, deps)

  return [value, error] as const
}

export const useObservable = <T extends any>(
  obs: Observable<T>,
  deps: DependencyList = [],
) => {
  const [value, setValue] = useState<T>()

  useEffect(() => {
    obs.subscribe(setValue)
  }, deps)

  return value
}
