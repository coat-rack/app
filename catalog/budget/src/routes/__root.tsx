import { AppContext } from "@coat-rack/sdk"
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"

function BudgetAppRoot() {
  return (
    <>
      <Outlet />
    </>
  )
}

export const Route = createRootRouteWithContext<AppContext>()({
  component: BudgetAppRoot,
})
