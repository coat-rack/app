import { DependencyList, useEffect, useState } from "react"
import { Observable } from "rxjs"

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
