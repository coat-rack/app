import { Progress } from "@coat-rack/ui/components/progress"
import { TableCell, TableRow } from "@coat-rack/ui/components/table"
import { useCurrencyFormatter } from "../format"
import { CategoryItem } from "../models"

export interface CategoryViewProps {
  category: CategoryItem
}

export function Category({ category }: CategoryViewProps) {
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
