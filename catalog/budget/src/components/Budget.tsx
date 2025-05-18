import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@coat-rack/ui/components/table"
import { CurrencyProvider, LocaleProvider } from "../context"
import { BudgetInstance } from "../models"
import { CategoryGroup } from "./CategoryGroup"

export interface BudgetProps {
  data: BudgetInstance
}
export function Budget({ data }: BudgetProps) {
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
              <CategoryGroup key={g.name} categoryGroup={g} />
            ))}
          </TableBody>
        </Table>
      </CurrencyProvider>
    </LocaleProvider>
  )
}
