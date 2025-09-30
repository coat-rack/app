import { useLoggedInContext } from "@/logged-in-context"
import { useObservable } from "@coat-rack/core/async"
import { ChartNetwork, User } from "@coat-rack/icons/regular"
import { FilterSolid } from "@coat-rack/icons/solid"

export const SpaceSelector = () => {
  const { db, filterSpaces, activeSpace, setFilterSpaces, setSelectedSpace } =
    useLoggedInContext()
  const spaces = useObservable(db.spaces.find({}).$)

  if (!spaces) {
    return undefined
  }

  return (
    <div className="flex flex-row items-center gap-2">
      {filterSpaces ? (
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
            className="flex h-6 flex-row items-center gap-2 text-nowrap border border-solid px-2"
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
            onClick={() => setSelectedSpace(space._data)}
            className="flex h-6 w-6 items-center justify-center"
            style={{ backgroundColor: space.color }}
            title={space.name}
          >
            {Icon}
          </button>
        )
      })}
    </div>
  )
}
