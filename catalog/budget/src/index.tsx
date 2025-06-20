import { App, ProvideAppContext } from "@coat-rack/sdk"

import { createRouter, RouterProvider } from "@tanstack/react-router"
import { CurrencyProvider, LocaleProvider } from "./context"
import { routeTree } from "./routeTree.gen"
import "./styles.css"

const router = createRouter({ routeTree })
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

export const BudgetApp: App = {
  /**
   *  The Entrypoint for the app
   */
  Entry: ({ context }) => {
    return (
      <ProvideAppContext {...context}>
        <LocaleProvider value={"en-NL"}>
          <CurrencyProvider value={"EUR"}>
            <RouterProvider router={router}></RouterProvider>
          </CurrencyProvider>
        </LocaleProvider>
      </ProvideAppContext>
    )
  },
}

export default BudgetApp
