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

export const setLocalUser = (user?: User) =>
  localDB.meta.upsertLocal<Meta<User | undefined>>(USER_META_KEY, {
    id: USER_META_KEY,
    value: user,
  })

export const useLocalUser = () =>
  useObservable(
    localDB.meta
      .getLocal$<Meta<User>>(USER_META_KEY)
      .pipe(map((result) => result?._data.data.value)),
    [],
  )

export const setLocalUserSpace = (space?: Space) =>
  localDB.meta.upsertLocal<Meta<Space | undefined>>(USER_SPACE_META_KEY, {
    id: USER_SPACE_META_KEY,
    value: space,
  })

export const useLocalUserSpace = () =>
  useObservable(
    localDB.meta
      .getLocal$<Meta<Space>>(USER_SPACE_META_KEY)
      .pipe(map((result) => result?._data.data.value)),
    [],
  )

export const setLocalSelectedSpace = (space?: Space) =>
  localDB.meta.upsertLocal<Meta<Space | undefined>>(SELECTED_SPACE_META_KEY, {
    id: SELECTED_SPACE_META_KEY,
    value: space,
  })

export const useLocalSelectedSpace = () =>
  useObservable(
    localDB.meta
      .getLocal$<Meta<Space>>(SELECTED_SPACE_META_KEY)
      .pipe(map((result) => result?._data.data.value)),
    [],
  )

export const useLocalActiveSpace = () => {
  const userSpace = useLocalUserSpace()
  const selectedSpace = useLocalSelectedSpace()

  const resolvedSpace = selectedSpace || userSpace

  return resolvedSpace
}

export const setLocalFilterSpaces = (active: boolean) =>
  localDB.meta.upsertLocal<Meta<boolean>>(FILTER_SPACES_META_KEY, {
    id: FILTER_SPACES_META_KEY,
    value: active,
  })

export const useLocalFilterSpaces = () =>
  useObservable(
    localDB.meta
      .getLocal$<Meta<boolean>>(FILTER_SPACES_META_KEY)
      .pipe(map((result) => result?._data.data.value || false)),
    [],
  )
