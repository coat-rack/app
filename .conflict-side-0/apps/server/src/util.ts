export type NonEmptyArray<T> = [T, ...T[]]

export const isDefined = <T>(value?: T): value is T => value !== undefined
