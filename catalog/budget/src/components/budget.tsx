import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@coat-rack/ui/components/table"
import { CurrencyProvider, LocaleProvider } from "../context"
import { BudgetModel } from "../data"
import { CategoryGroupView } from "./categoryGroup"

export interface BudgetViewProps {
  data: BudgetModel
}
export function BudgetView({ data }: BudgetViewProps) {
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
