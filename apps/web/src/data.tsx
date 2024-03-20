import { PropsWithChildren, createContext, useContext, useState } from "react"
import { RxDatabase } from "rxdb"
import { usePromise } from "./async"
import {
  SyncedRxSchema,
  setLocalUser,
  setupUserDB,
  useLocalUser,
} from "./db/rxdb"
import { trpcClient } from "./trpc"

import { Button } from "@repo/ui/components/button"

interface Context {
  user: string
  db: RxDatabase<SyncedRxSchema>
  signOut: () => void
}

const Context = createContext<Context>(undefined as unknown as Context)

export const useDatabase = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error("Cannot use outside of the DatabaseProvider")
  }

  return context
}

interface Props {
  onLogin: (user: string) => void
}

const LoginScreen = ({ onLogin }: Props) => {
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  const logIn = () =>
    trpcClient.users.login
      .query({ name })
      .then((result) => {
        if (result) {
          onLogin(result.name)
        } else {
          setError("User not found")
        }
      })
      .catch(() => setError("Invalid login"))

  const signUp = () =>
    trpcClient.users.create
      .mutate({
        name,
      })
      .then((user) => onLogin(user.id))
      .catch(() => setError("Invalid username"))

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="font-title text-5xl">Login</h1>

      <input
        className="border-4 border-solid border-black p-4"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />

      <Button onClick={logIn}>Log In</Button>
      <Button onClick={signUp}>Sign Up</Button>

      <div>{error && <p className="text-red-500">{error}</p>}</div>
    </div>
  )
}

export const DatabaseProvider = ({ children }: PropsWithChildren) => {
  const user = useLocalUser()

  const login = (username: string) => setLocalUser(username)

  const dbSetup = usePromise(async () => {
    if (!user) {
      return
    }

    return setupUserDB(user)
  }, [user])

  if (!(dbSetup && user)) {
    return <LoginScreen onLogin={login} />
  }

  const { db } = dbSetup

  const signOut = () => {
    // For now we're just logging out the user but we may want to cleanup the DB here in the future
    setLocalUser(undefined)
  }

  return (
    <Context.Provider
      value={{
        user,
        db,
        signOut,
      }}
    >
      {children}
    </Context.Provider>
  )
}
