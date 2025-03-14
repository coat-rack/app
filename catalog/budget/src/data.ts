export interface Category {
  name: string
  assignedAmount: number
  spentAmount: number
}

export interface CategoryGroup {
  name: string
  categories: Category[]
}

export interface BudgetModel {
  categoryGroups: CategoryGroup[]
  startDate: Date
  endDate: Date
  locale: string
  currency: string
}
