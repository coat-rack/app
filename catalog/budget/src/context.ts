import { createContext, useContext } from "react"

export type LocaleContext = Intl.LocalesArgument

const LocaleContext = createContext<LocaleContext>(
  undefined as unknown as LocaleContext,
)

export const LocaleProvider = LocaleContext.Provider

export const useLocale = () => {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error("Locale not set")
  }
  return context
}

export type CurrencyContext = string

const CurrencyContext = createContext<CurrencyContext>(
  undefined as unknown as CurrencyContext,
)
export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error("Currency not set")
  }
  return context
}
export const CurrencyProvider = CurrencyContext.Provider
