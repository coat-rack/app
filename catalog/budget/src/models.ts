import { DbRecord } from "@coat-rack/sdk"

export enum CategoryKind {
  ReadyToAssign = 1,
  Normal = 2,
}
export interface Category extends Model<"category"> {
  name: string
  group: DbRef<CategoryGroup>
  target?: { amount: number; date?: Date }
  kind: CategoryKind
}

export interface CategoryGroup extends Model<"categorygroup"> {
  name: string
}

export interface Budget extends Model<"budget"> {
  locale: string
  currency: string
  name: string
}

export interface BudgetCycle extends Model<"budgetcycle"> {
  startDate: Date
  endDate: Date
  assignments: Record<DbRef<Category>, { assignedAmount: number }>
  budget: DbRef<Budget>
}

export interface Account extends Model<"account"> {
  name: string
}

export interface Transaction extends Model<"transaction"> {
  amount: number
  payee: string
  description: string
  date: Date
  account: DbRef<Account>
  category: DbRef<Category>
}

export interface Remember {
  lastOpenedBudget?: DbRef<Budget>
}

const Brand = Symbol()
type Brand = typeof Brand
type DbRef<T extends Model<string>> = {
  [Brand]: T["type"]
} & string

export function getDbRef<T extends Model<string>>(
  model: DbRecord<T>,
): DbRef<T> {
  return model.id as DbRef<T>
}

type Model<T extends string> = {
  type: T
}

export type DbTypes =
  | Category
  | CategoryGroup
  | Budget
  | BudgetCycle
  | Account
  | Transaction
  | Remember
