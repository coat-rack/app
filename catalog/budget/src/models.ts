export interface CategoryItem {
  name: string
  assignedAmount: number
  spentAmount: number
}

export interface CategoryGroupItem {
  name: string
  categories: CategoryItem[]
}

export interface BudgetInstance {
  categoryGroups: CategoryGroupItem[]
  startDate: Date
  endDate: Date
  locale: string
  currency: string
}
