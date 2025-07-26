import { useObservable } from "@coat-rack/core/async"
import { KeyValue, Space, User } from "@coat-rack/core/models"
import { map } from "rxjs"
import { localDB } from "./rxdb"

export const USER_META_KEY = "user"

export const SELECTED_SPACE_META_KEY = "space"

export const USER_SPACE_META_KEY = "user-space"

export const FILTER_SPACES_META_KEY = "filter-spaces"

interface Meta<T> extends KeyValue {
  value: T
}

const useLocalMetaStore = <T>(key: string) => {
  const value = useObservable(
    localDB.meta
      .getLocal$<Meta<T>>(key)
      .pipe(map((result) => result?._data.data.value)),
    [],
  )

  const setValue = (value?: T) =>
    localDB.meta.upsertLocal<Meta<T | undefined>>(key, {
      id: key,
      value,
    })

  return [value, setValue] as const
}

export const useLocalUser = () => useLocalMetaStore<User>(USER_META_KEY)

export const useLocalUserSpace = () =>
  useLocalMetaStore<Space>(USER_SPACE_META_KEY)

export const useLocalSelectedSpace = () =>
  useLocalMetaStore<Space>(SELECTED_SPACE_META_KEY)

export const useLocalFilterSpaces = () =>
  useLocalMetaStore<boolean>(FILTER_SPACES_META_KEY)
