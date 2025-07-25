import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { setupUserDB } from "./db/rxdb"
import { trpcClient } from "./trpc"

import { Space, User } from "@coat-rack/core/models"
import { Button } from "@coat-rack/ui/components/button"
import { Input } from "@coat-rack/ui/components/input"
import { firstValueFrom } from "rxjs"
import {
  setLocalFilterSpaces,
  setLocalSelectedSpace,
  setLocalUser,
  setLocalUserSpace,
  useLocalActiveSpace,
  useLocalFilterSpaces,
  useLocalUser,
  useLocalUserSpace,
} from "./db/local"

type ConfiguredDB = Awaited<ReturnType<typeof setupUserDB>>

interface LoggedInContext extends ConfiguredDB {
  /**
   * This should be unique across users so is fine for querying against
   */
  user: User
  userSpace: Space
  activeSpace: Space
  filterSpaces?: boolean

  setActiveSpace: (space: Space) => void
  setFilterSpaces: (filter: boolean) => void
  signOut: () => void
}

const Context = createContext<LoggedInContext>(
  undefined as unknown as LoggedInContext,
)

export const useLoggedInContext = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error("Cannot use outside of the DatabaseProvider")
  }

  return context
}

interface Props {
  onLogin: (user: User) => void
}

const LoginScreen = ({ onLogin }: Props) => {
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  const logIn = () =>
    trpcClient.users.login
      .query({ name })
      .then((result) => {
        if (result) {
          onLogin(result)
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
      .then((user) => onLogin(user))
      .catch(() => setError("Invalid username"))

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="font-title text-5xl">Login</h1>

      <Input onChange={(e) => setName(e.target.value)} value={name} />

      <Button onClick={logIn}>Log In</Button>
      <Button onClick={signUp}>Sign Up</Button>

      <div>{error && <p className="text-red-500">{error}</p>}</div>
    </div>
  )
}

export const DatabaseProvider = ({ children }: PropsWithChildren) => {
  const user = useLocalUser()
  const userSpace = useLocalUserSpace()
  const activeSpace = useLocalActiveSpace()
  const filterSpaces = useLocalFilterSpaces()

  const [dbSetup, setDbSetup] = useState<ConfiguredDB>()

  const login = async (loginUser: User) => {
    setLocalUser(loginUser)
  }

  useEffect(() => {
    if (!user) {
      return
    }

    const setupUserData = async () => {
      const db = await setupUserDB(user.id)
      await db.spacesCollection.awaitInitialReplication()

      const space = await firstValueFrom(db.db.spaces.findOne(user.id).$)

      if (!(space && user)) {
        throw new Error("User space could not be found in collection")
      }

      setDbSetup(db)
      setLocalUserSpace(space._data)
    }

    setupUserData()
  }, [user?.id])

  if (!(dbSetup && user && userSpace && activeSpace)) {
    return <LoginScreen onLogin={login} />
  }

  const signOut = () => {
    // For now we're just logging out the user but we may want to cleanup the DB here in the future
    setLocalUser(undefined)
    setLocalUserSpace(undefined)
    setLocalSelectedSpace(undefined)
  }

  return (
    <Context.Provider
      value={{
        ...dbSetup,
        user,
        userSpace,
        activeSpace,
        signOut,
        filterSpaces,
        setFilterSpaces: setLocalFilterSpaces,
        setActiveSpace: setLocalSelectedSpace,
      }}
    >
      {children}
    </Context.Provider>
  )
}
