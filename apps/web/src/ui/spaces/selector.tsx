import { useObservable } from "@/async"
import { useDatabase } from "@/data"
import {
  setActiveSpace,
  setFilterSpaces,
  useActiveSpace,
  useFilterSpaces,
} from "@/db/rxdb"
import { ChartNetwork, User } from "@repo/icons/regular"
import { FilterSolid } from "@repo/icons/solid"

export const SpaceSelector = () => {
  const { db } = useDatabase()
  const spaces = useObservable(db.spaces.find({}).$)
  const activeSpace = useActiveSpace()
  const isFiltered = useFilterSpaces()

  if (!spaces) {
    return undefined
  }

  return (
    <div className="flex flex-row items-center gap-4">
      {spaces.map((space) => {
        const Icon =
          space.spaceType === "user" ? (
            <User className="h-3 w-3 fill-current" />
          ) : (
            <ChartNetwork className="h-3 w-3 fill-current" />
          )

        return space.id === activeSpace?.id ? (
          <div
            key={space.id}
            className="flex h-6 flex-row items-center gap-2 border border-solid px-2 text-xs"
            style={{
              borderColor: space.color,
              backgroundColor: space.color,
            }}
          >
            {Icon}
            {space.name}
          </div>
        ) : (
          <button
            key={space.id}
            onClick={() => setActiveSpace(space._data)}
            className="flex h-6 w-6 items-center justify-center"
            style={{ backgroundColor: space.color }}
            title={space.name}
          >
            {Icon}
          </button>
        )
      })}

      {isFiltered ? (
        <button
          title="Show all spaces"
          className="bg-primary flex h-6 w-6 items-center justify-center"
          onClick={() => setFilterSpaces(false)}
        >
          <FilterSolid className="h-3 w-3 fill-current" />
        </button>
      ) : (
        <button
          title="Show active space"
          className="border-primary bg-primary-foreground flex h-6 w-6 items-center justify-center"
          onClick={() => setFilterSpaces(true)}
        >
          <FilterSolid className="h-3 w-3 fill-current" />
        </button>
      )}
    </div>
  )
}
