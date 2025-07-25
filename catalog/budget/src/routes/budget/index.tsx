import { createFileRoute, Link, redirect } from "@tanstack/react-router"
import { Budget, Remember } from "../../models"
import { Route as budgetWithIdRoute } from "./$budgetId"

export const Route = createFileRoute("/budget/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const remember = await context.db.get<Remember>("remember")
    const budgets = await context.db.query<Budget>()
    if (remember) {
      const found = budgets.find(
        (x) => x.id === remember?.data.lastOpenedBudget,
      )
      if (found) {
        throw redirect({
          to: budgetWithIdRoute.to,
          params: {
            budgetId: remember.data.lastOpenedBudget as string,
          },
        })
      }
    }

    if (budgets.length === 1) {
      throw redirect({
        to: budgetWithIdRoute.to,
        params: {
          budgetId: budgets[0]!.id,
        },
      })
    }

    return budgets
  },
})

function RouteComponent({}) {
  const budgets = Route.useLoaderData()
  return (
    <div>
      <h1>Select a budget:</h1>
      <ul>
        {budgets.map((budget) => (
          <li>
            <Link to={budgetWithIdRoute.to} params={{ budgetId: budget.id }}>
              {budget.data.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
