import { App, ProvideAppContext } from "@coat-rack/sdk"

import { ChevronDown, ChevronUp } from "@coat-rack/icons/regular"
import { Button } from "@coat-rack/ui/components/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@coat-rack/ui/components/collapsible"
import { Progress } from "@coat-rack/ui/components/progress"
import { useState } from "react"
import { BudgetModel, Category, CategoryGroup } from "./data"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@coat-rack/ui/components/table"
import { CurrencyProvider, LocaleProvider } from "./context"
import { useCurrencyFormatter } from "./format"
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

interface BudgetViewProps {
  data: BudgetModel
}
function BudgetView({ data }: BudgetViewProps) {
  return (
    <LocaleProvider value={data.locale}>
      <CurrencyProvider value={data.currency}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead>Spent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.categoryGroups.map((g) => (
              <CategoryGroupView key={g.name} categoryGroup={g} />
            ))}
          </TableBody>
        </Table>
      </CurrencyProvider>
    </LocaleProvider>
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

  const amountFormatter = useCurrencyFormatter()
  return (
    <Collapsible open={open} onOpenChange={setOpen} asChild>
      <>
        <TableRow>
          <TableCell>
            <CollapsibleTrigger>
              <Button asChild>{open ? <ChevronDown /> : <ChevronUp />}</Button>
            </CollapsibleTrigger>
          </TableCell>
          <TableCell>{categoryGroup.name}</TableCell>
          <TableCell>{amountFormatter.format(totalAssigned)}</TableCell>
          <TableCell>{amountFormatter.format(totalSpent)}</TableCell>
        </TableRow>
        {open &&
          categoryGroup.categories.map((category) => (
            <CategoryView key={category.name} category={category} />
          ))}
        <CollapsibleContent></CollapsibleContent>
      </>
    </Collapsible>
  )
}

interface CategoryViewProps {
  category: Category
}

function CategoryView({ category }: CategoryViewProps) {
  const formatter = useCurrencyFormatter()
  return (
    <TableRow key={category.name}>
      <TableCell>{/* Empty space for chevron */}</TableCell>
      <TableCell>
        <div>{category.name}</div>
        <div>
          <Progress
            value={(category.spentAmount / category.assignedAmount) * 100}
            size={"slim"}
          ></Progress>
        </div>
      </TableCell>
      <TableCell>{formatter.format(category.assignedAmount)}</TableCell>
      <TableCell>{formatter.format(category.spentAmount)}</TableCell>
    </TableRow>
  )
}

export default Budget
