import { Space } from "@repo/data/models"
import { ChartNetwork, User } from "@repo/icons/regular"
import { FilterSolid, HomeSolid, OctagonTimesSolid } from "@repo/icons/solid"
import { Button } from "@repo/ui/components/button"
import { Link } from "@tanstack/react-router"
import { PropsWithChildren } from "react"
import { useObservable } from "./async"
import { useDatabase } from "./data"
import {
  setActiveSpace,
  setFilterSpaces,
  useActiveSpace,
  useFilterSpaces,
} from "./db/rxdb"

type Props = PropsWithChildren<{
  title?: string
}>

const Navigation = ({
  signOut,
  title = "",
  Links,
  children,
}: React.PropsWithChildren<{
  Links?: React.ReactNode
  signOut: () => void
  title?: string
}>) => (
  <div
    className="relative grid h-screen w-screen"
    style={{
      gridTemplateRows: "auto 1fr",
      gridTemplateColumns: "auto 1fr",
    }}
  >
    <nav className="bg-background col-span-2 row-auto flex flex-row items-center justify-between p-2 pl-0">
      <div className="flex flex-row items-center gap-4">
        <Button asChild variant="link" size="sm">
          <Link
            className="flex flex-row gap-2"
            to="/"
            activeProps={{
              className: "text-primary",
            }}
            title="Home"
          >
            <HomeSolid className="h-4 w-4 fill-current" />
            Home
          </Link>
        </Button>

        <SpaceSelector />
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="align-center flex flex-row gap-2 justify-self-end"
        onClick={signOut}
        title="Sign out"
      >
        sign out
        <OctagonTimesSolid className="h-4 w-4 fill-current" />
      </Button>
    </nav>
    <nav
      className="bg-background col-span-1 py-4"
      style={{
        writingMode: "vertical-rl",
      }}
    >
      <div className="flex flex-1 rotate-180 justify-between gap-4">
        {Links}
      </div>
    </nav>

    <main>{children}</main>
  </div>
)

const SpaceSelector = () => {
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

export const SpaceProvider = ({
  space,
  children,
}: React.PropsWithChildren<{ space?: Space }>) => {
  return (
    <div style={{ "--space": space?.color } as React.CSSProperties}>
      {children}
    </div>
  )
}

export const Layout = ({ title, children }: Props) => {
  const { signOut, db } = useDatabase()
  const apps = useObservable(db.apps.find({}).$)
  const space = useActiveSpace()

  return (
    <SpaceProvider space={space}>
      <Navigation
        signOut={signOut}
        title={title}
        Links={apps?.map((app) => (
          <Button asChild variant="link" size="sm" key={app.id}>
            <Link
              to="/apps/$id"
              className="block"
              activeProps={{
                className: "underline",
              }}
              params={{
                id: app.id,
              }}
            >
              {app.id}
            </Link>
          </Button>
        ))}
      >
        {children}
      </Navigation>
    </SpaceProvider>
  )
}
