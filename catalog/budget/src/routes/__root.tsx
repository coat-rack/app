import { createRootRoute, Link, Outlet } from "@tanstack/react-router"

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="flex gap-2 p-2">
        <Link to="/" className="[&.active]:font-bold">
          Budget
        </Link>{" "}
        <Link to="/account" className="[&.active]:font-bold">
          Account
        </Link>
      </div>
      <hr />
      <Outlet />
    </>
  ),
})
