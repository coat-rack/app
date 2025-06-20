import { createFileRoute } from "@tanstack/react-router"
import { Budget } from "../components/Budget"
import { BudgetInstance, CategoryItem } from "../models"

const rentCategory: CategoryItem = {
  name: "🏡 Rent",
  assignedAmount: 100,
  spentAmount: 100,
}

const healthInsuranceCategory: CategoryItem = {
  name: "🏥 Health Insurance",
  assignedAmount: 50,
  spentAmount: 50,
}
const groceries: CategoryItem = {
  name: "🛒 Groceries",
  assignedAmount: 30,
  spentAmount: 20,
}

const transport: CategoryItem = {
  name: "🚝 Train",
  assignedAmount: 10,
  spentAmount: 5,
}

const eatingOut: CategoryItem = {
  name: "🍔 Eating Out",
  assignedAmount: 10,
  spentAmount: 0,
}

const clothes: CategoryItem = {
  name: "👕 Clothes",
  assignedAmount: 10,
  spentAmount: 8,
}

const sampleData: BudgetInstance = {
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
  locale: "nl-NL",
  currency: "EUR",
}

export const Route = createFileRoute("/")({
  component: Index,
})

function Index() {
  return <Budget data={sampleData}></Budget>
}
