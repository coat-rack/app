import { useCurrency, useLocale } from "./context"

export function useCurrencyFormatter() {
  const locale = useLocale()
  const currency = useCurrency()
  return Intl.NumberFormat(locale, { style: "currency", currency })
}
