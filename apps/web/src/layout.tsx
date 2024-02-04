import { PropsWithChildren, createContext, useContext, useState } from "react"
import { setDBUser, useDBUser } from "./db"

type Props = PropsWithChildren<{
  title?: string
}>

const LoginScreen = () => {
  const [value, setValue] = useState("")

  const logIn = () => setDBUser(value)

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="font-title text-5xl">Login</h1>

      <input
        className="p-4 border-solid border-black border-4"
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />

      <button onClick={logIn}>Log In</button>
    </div>
  )
}

const UserContext = createContext("")

export const useUser = () => useContext(UserContext)

export const Layout = ({ title, children }: Props) => {
  const user = useDBUser()

  if (!user) {
    return <LoginScreen />
  }

  return (
    <UserContext.Provider value={user.value}>
      <div className="flex flex-col gap-4 p-4">
        {title && <h1 className="font-title text-5xl">{title}</h1>}
        <p>User: {user.value}</p>
        <div>{children}</div>
      </div>
    </UserContext.Provider>
  )
}
