import { App, ProvideAppContext } from "@coat-rack/sdk"

import { BudgetModel, Category } from "./models"

import { BudgetView } from "./components/budget"
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
  locale: "nl-NL",
  currency: "EUR",
}

export const Budget: App = {
  /**
   *  The Entrypoint for the app
   */
  Entry: ({ context }) => {
    return (
      <ProvideAppContext {...context}>
        <h1>Budget</h1>
        <BudgetView data={sampleData} />
      </ProvideAppContext>
    )
  },
}

export default Budget
