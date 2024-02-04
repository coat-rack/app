import { PropsWithChildren, useState } from "react"
import { setDBUser, useDBUser } from "./db"
import { trpcClient } from "./trpc"

type Props = PropsWithChildren<{
  title?: string
}>

const LoginScreen = () => {
  const [value, setValue] = useState("")

  const logIn = () => setDBUser(value)
  const signUp = () => {
    trpcClient.users.create
      .mutate({
        name: value,
      })
      .then((user) => setDBUser(user.id))
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="font-title text-5xl">Login</h1>

      <input
        className="p-4 border-solid border-black border-4"
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />

      <button onClick={logIn}>Log In</button>
      <button onClick={signUp}>Sign Up</button>
    </div>
  )
}

export const Layout = ({ title, children }: Props) => {
  const user = useDBUser()

  if (!user) {
    return <LoginScreen />
  }

  const signOut = () => setDBUser(undefined)

  return (
    <div className="flex flex-col gap-4 p-4">
      {title && <h1 className="font-title text-5xl">{title}</h1>}
      <div>
        <span>User: {user}</span>
        <button onClick={signOut}>Sign out</button>
      </div>

      <div>{children}</div>
    </div>
  )
}
