import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/account/$accountId")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/account/$accountId"!</div>
}
