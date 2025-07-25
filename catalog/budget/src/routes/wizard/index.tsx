import { Spinner } from "@coat-rack/icons/regular"
import { useAppContext } from "@coat-rack/sdk"
import { Button } from "@coat-rack/ui/components/button"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { Budget } from "../../models"
import { Route as budgetRoute } from "../budget/$budgetId"

export const Route = createFileRoute("/wizard/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { db } = useAppContext()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)

  const createBudget = () => {
    if (saving) {
      return
    }

    setSaving(true)
    const budget: Budget = {
      name: "Sample budget",
      currency: "EUR",
      locale: "nl-NL",
      type: "budget",
    }
    db.create(budget).then((val) => {
      setSaving(false)
      navigate({
        to: budgetRoute.to,
        params: {
          budgetId: val.id,
        },
      })
    })
  }

  return (
    <div>
      <p>You don't have any budgets set up.</p>
      <Button onClick={createBudget}>
        {saving ? <Spinner></Spinner> : <>Click to create one!</>}
      </Button>
    </div>
  )
}
