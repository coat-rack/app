import { Space, User } from "@coat-rack/core/models"
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { firstValueFrom } from "rxjs"
import {
  useLocalFilterSpaces,
  useLocalSelectedSpace,
  useLocalUser,
  useLocalUserSpace,
} from "./db/local"
import { setupUserDB } from "./db/rxdb"
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

  setSelectedSpace: (space: Space) => void
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
  const [user, setUser] = useLocalUser()
  const [userSpace, setUserSpace] = useLocalUserSpace()
  const [selectedSpace, setSelectedSpace] = useLocalSelectedSpace()
  const [filterSpaces, setFilterSpaces] = useLocalFilterSpaces()

  const activeSpace = selectedSpace || userSpace

  const [dbSetup, setDbSetup] = useState<ConfiguredDB>()

  const login = async (loginUser: User) => {
    setUser(loginUser)
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
      setUserSpace(space._data)
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
    setUser(undefined)
    setUserSpace(undefined)
    setSelectedSpace(undefined)
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
        setFilterSpaces,
        setSelectedSpace,
      }}
    >
      {children}
    </Context.Provider>
  )
}
