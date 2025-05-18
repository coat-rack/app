import { ChevronDown, ChevronUp } from "@coat-rack/icons/regular"
import { Button } from "@coat-rack/ui/components/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@coat-rack/ui/components/collapsible"
import { TableCell, TableRow } from "@coat-rack/ui/components/table"
import { useState } from "react"
import { useCurrencyFormatter } from "../format"
import { CategoryGroupItem } from "../models"
import { Category } from "./Category"

export interface CategoryGroupViewProps {
  categoryGroup: CategoryGroupItem
}

export function CategoryGroup({ categoryGroup }: CategoryGroupViewProps) {
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
            <Category key={category.name} category={category} />
          ))}
        <CollapsibleContent></CollapsibleContent>
      </>
    </Collapsible>
  )
}
