import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { setupUserDB } from "./db/rxdb"

import { Space, User } from "@coat-rack/core/models"
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
import { trpcClient } from "./trpc"
import { LoginForm } from "./ui/login/form"

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

export const LoggedInContextProvider = ({ children }: PropsWithChildren) => {
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

  const logIn = (name: string) => trpcClient.users.login.query({ name })
  const signUp = (name: string) => trpcClient.users.create.mutate({ name })

  if (!(dbSetup && user && userSpace && activeSpace)) {
    return <LoginForm logIn={logIn} signUp={signUp} onLogin={login} />
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
