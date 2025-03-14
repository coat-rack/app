import { App } from "@repo/sdk"

import { Button } from "@repo/ui/components/button"
import { Card } from "@repo/ui/components/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/ui/components/collapsible"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "../../../packages/icons/src/regular"
import { BudgetModel, Category, CategoryGroup } from "./data"
import "./styles.css"

const rentCategory: Category = {
  name: "🏡 Rent",
  assignedAmount: 100,
  spentAmount: 100,
}

const healthInsuranceCategory: Category = {
  name: "🏥 Health Insurance",
  assignedAmount: 50,
  spentAmount: 50,
}
const groceries: Category = {
  name: "🛒 Groceries",
  assignedAmount: 30,
  spentAmount: 20,
}

const transport: Category = {
  name: "🚝 Train",
  assignedAmount: 10,
  spentAmount: 5,
}

const eatingOut: Category = {
  name: "🍔 Eating Out",
  assignedAmount: 10,
  spentAmount: 0,
}

const clothes: Category = {
  name: "👕 Clothes",
  assignedAmount: 10,
  spentAmount: 8,
}

const sampleData: BudgetModel = {
  categoryGroups: [
    {
      name: "Bills",
      categories: [rentCategory, healthInsuranceCategory],
    },
    {
      name: "Needs",
      categories: [groceries, transport],
    },
    {
      name: "Wants",
      categories: [eatingOut, clothes],
    },
  ],
  startDate: new Date(2025, 2, 1),
  endDate: new Date(2025, 2, 31, 23, 59, 59),
}

export const Budget: App = {
  /**
   *  The Entrypoint for the app
   */
  Entry: () => {
    return (
      <>
        <h1 className="bg-red-500">Budget</h1>
        <BudgetView data={sampleData} />
      </>
    )
  },
}

interface BudgetViewProps {
  data: BudgetModel
}
function BudgetView({ data }: BudgetViewProps) {
  return (
    <div>
      {data.categoryGroups.map((g) => (
        <CategoryGroupView categoryGroup={g} />
      ))}
    </div>
  )
}

interface CategoryGroupViewProps {
  categoryGroup: CategoryGroup
}

function CategoryGroupView({ categoryGroup }: CategoryGroupViewProps) {
  const totalAssigned = categoryGroup.categories.reduce(
    (sum, category) => (sum += category.assignedAmount),
    0,
  )
  const totalSpent = categoryGroup.categories.reduce(
    (sum, category) => (sum += category.spentAmount),
    0,
  )

  const [open, setOpen] = useState(true)

  return (
    <Card>
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="header columns-4">
          <CollapsibleTrigger asChild>
            <Button asChild>{open ? <ChevronDown /> : <ChevronUp />}</Button>
          </CollapsibleTrigger>
          <div>{categoryGroup.name}</div>
          <div>{totalAssigned}</div>
          <div>{totalSpent}</div>
        </div>

        <CollapsibleContent>
          {categoryGroup.categories.map((category) => (
            <CategoryView category={category}></CategoryView>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

interface CategoryViewProps {
  category: Category
}

function CategoryView({ category }: CategoryViewProps) {
  return (
    <Card className="columns-3">
      <div>{category.name}</div>
      <div>{category.assignedAmount}</div>
      <div>{category.spentAmount}</div>
    </Card>
  )
}

export default Budget
