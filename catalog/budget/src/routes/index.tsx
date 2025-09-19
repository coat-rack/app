import { createFileRoute, redirect } from "@tanstack/react-router"
import { Budget } from "../models"
import { Route as budgetRoute } from "./budget"
import { Route as wizardRoute } from "./wizard/index"

export const Route = createFileRoute("/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const budgets = await context.db.query<Budget>({ type: "budget" })
    if (!budgets.length) {
      throw redirect({
        to: wizardRoute.to,
      })
    }

    throw redirect({
      to: budgetRoute.to,
    })
  },
})

function RouteComponent() {
  return <div>You should never get here!</div>
}
