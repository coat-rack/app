import { useLoggedInContext } from "@/logged-in-context"
import { HomeSolid, OctagonTimesSolid } from "@coat-rack/icons/solid"
import { getSpaceStyles } from "@coat-rack/sdk"
import { Button } from "@coat-rack/ui/components/button"
import { Link } from "@tanstack/react-router"
import "./navigation.css"
import { SpaceSelector } from "./spaces/selector"

export const Navigation = ({
  signOut,
  Links,
  children,
}: React.PropsWithChildren<{
  Links?: React.ReactNode
  signOut: () => void
}>) => {
  const { activeSpace } = useLoggedInContext()
  const spaceStyles = getSpaceStyles(activeSpace)

  return (
    <div
      className="grid-container bg-background relative h-dvh w-dvw"
      style={{
        ...spaceStyles,
      }}
    >
      <Button asChild variant="link" size="sm">
        <Link
          className="home flex flex-row gap-2 text-base"
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

      <Button
        variant="link"
        size="sm"
        className="align-center signout flex flex-row gap-2 justify-self-end p-4 text-base"
        onClick={signOut}
        title="Sign out"
      >
        sign out
        <OctagonTimesSolid className="h-4 w-4 fill-current" />
      </Button>

      <nav
        className="sidebar"
        style={{
          writingMode: "vertical-rl",
        }}
      >
        <div className="flex flex-1 rotate-180 justify-between gap-4 px-2 py-2">
          {Links}
        </div>
      </nav>
      <main className="content">{children}</main>
      <div className="spaces flex flex-row items-center overflow-x-auto px-2 pb-3 pt-1 md:pb-1">
        <SpaceSelector />
      </div>
    </div>
  )
}
