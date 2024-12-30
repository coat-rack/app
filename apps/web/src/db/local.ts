import { useObservable } from "@repo/core/async"
import { KeyValue, Space } from "@repo/data/models"
import { map } from "rxjs"
import { localDB } from "./rxdb"

export const USER_META_KEY = "user"

export const ACTIVE_SPACE_META_KEY = "space"

export const FILTER_SPACES_META_KEY = "filter-spaces"

interface Meta<T> extends KeyValue {
  value: T
}

export const setLocalUser = (username?: string) =>
  localDB.meta.upsertLocal<Meta<string | undefined>>(USER_META_KEY, {
    id: USER_META_KEY,
    value: username,
  })

export const useLocalUser = () =>
  useObservable(
    localDB.meta
      .getLocal$<Meta<string | undefined>>(USER_META_KEY)
      .pipe(map((result) => result?._data.data.value)),
    [],
  )

export const setActiveSpace = (space: Space) =>
  localDB.meta.upsertLocal<Meta<Space>>(ACTIVE_SPACE_META_KEY, {
    id: ACTIVE_SPACE_META_KEY,
    value: space,
  })

export const useActiveSpace = () =>
  useObservable(
    localDB.meta
      .getLocal$<Meta<Space>>(ACTIVE_SPACE_META_KEY)
      .pipe(map((result) => result?._data.data.value)),
    [],
  )

export const setFilterSpaces = (active: boolean) =>
  localDB.meta.upsertLocal<Meta<boolean>>(FILTER_SPACES_META_KEY, {
    id: FILTER_SPACES_META_KEY,
    value: active,
  })

export const useFilterSpaces = () =>
  useObservable(
    localDB.meta
      .getLocal$<Meta<boolean>>(FILTER_SPACES_META_KEY)
      .pipe(map((result) => result?._data.data.value || false)),
    [],
  )
