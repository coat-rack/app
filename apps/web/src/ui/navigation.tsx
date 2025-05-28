import { useActiveSpace } from "@/db/local"
import { HomeSolid, OctagonTimesSolid } from "@coat-rack/icons/solid"
import { getSpaceStyles } from "@coat-rack/sdk"
import { Button } from "@coat-rack/ui/components/button"
import { Link } from "@tanstack/react-router"
import { SpaceSelector } from "./spaces/selector"

export const Navigation = ({
  signOut,
  Links,
  children,
}: React.PropsWithChildren<{
  Links?: React.ReactNode
  signOut: () => void
}>) => {
  const activeSpace = useActiveSpace()
  const spaceStyles = getSpaceStyles(activeSpace)

  return (
    <div
      className="relative grid h-dvh w-dvw"
      style={{
        ...spaceStyles,
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
      <main className="bg-background">{children}</main>
    </div>
  )
}
