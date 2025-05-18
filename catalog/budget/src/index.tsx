import { App, ProvideAppContext } from "@coat-rack/sdk"

import { BudgetInstance, CategoryItem } from "./models"

import { Budget } from "./components/budget"
import "./styles.css"

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

export const BudgetApp: App = {
  /**
   *  The Entrypoint for the app
   */
  Entry: ({ context }) => {
    return (
      <ProvideAppContext {...context}>
        <h1>Budget</h1>
        <Budget data={sampleData} />
      </ProvideAppContext>
    )
  },
}

export default BudgetApp
