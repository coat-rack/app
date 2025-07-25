import { createFileRoute } from "@tanstack/react-router"
import { Account } from "../components/Account"
import { AccountInstance } from "../models"

export const Route = createFileRoute("/account")({
  component: About,
})

const account: AccountInstance = {
  name: "Account 1",
  transactions: [
    {
      amount: 100,
      date: new Date(),
      description: "test long",
      payee: "test",
    },
  ],
}

function About() {
  return <Account account={account}></Account>
}
