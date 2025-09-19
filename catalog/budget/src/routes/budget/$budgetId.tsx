import { createFileRoute, notFound } from "@tanstack/react-router"
import { Budget, Remember, getDbRef } from "../../models"

export const Route = createFileRoute("/budget/$budgetId")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const budget = await context.db.get<Budget>(params.budgetId)
    if (!budget) {
      throw notFound()
    }

    console.log(context.activeSpace)
    await context.db.update<Remember>("remember", context.activeSpace!.id, {
      lastOpenedBudget: getDbRef(budget),
    })

    return budget
  },
})

function RouteComponent() {
  const params = Route.useParams()
  const hello = `Hello "/budget/${params.budgetId}"!`
  return <div>{hello}</div>
}
