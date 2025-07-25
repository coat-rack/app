import { Table, TableCell, TableRow } from "@coat-rack/ui/components/table"
import { useCurrencyFormatter } from "../format"
import { AccountInstance, TransactionItem } from "../models"

export interface AccountProps {
  account: AccountInstance
}

export function Account({ account }: AccountProps) {
  const formatter = useCurrencyFormatter()
  const dates = Array.from(
    account.transactions.reduce((dates, curr) => {
      let transactions = dates.get(curr.date)
      if (!transactions) {
        transactions = []
        dates.set(curr.date, transactions)
      }
      transactions.push(curr)
      return dates
    }, new Map<Date, TransactionItem[]>()),
  )
  return (
    <Table>
      {dates.map(([date, transactions]) => (
        <>
          <TableRow>
            <TableCell>{date.toDateString()}</TableCell>
            <TableCell>{/* empty space for amount */}</TableCell>
          </TableRow>
          {transactions.map((tran) => (
            <TableRow>
              <TableCell>
                <div>
                  <div>{tran.payee}</div>
                  <div>{tran.description}</div>
                </div>
              </TableCell>
              <TableCell>{formatter.format(tran.amount)}</TableCell>
            </TableRow>
          ))}
        </>
      ))}
    </Table>
  )
}
