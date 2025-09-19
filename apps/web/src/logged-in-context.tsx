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

function getServerUrl() {
  const url = new URL(window.location.toString())
  url.port = import.meta.env.VITE_SERVER_PORT
  url.pathname = ""
  return url
}

function getCredentials(rpId: string, id: BufferSource) {
  return navigator.credentials.get({
    publicKey: {
      rpId,
      challenge: new Uint8Array([117, 61, 252, 231, 191, 241 /* … */]),
      allowCredentials: [
        {
          id,
          type: "public-key",
        },
      ],
      userVerification: "required",
    },
  })
}

function createCredentials(
  rpId: string,
  userId: Uint8Array,
  name: string,
  displayName: string,
  challenge: Uint8Array,
) {
  return navigator.credentials.create({
    publicKey: {
      challenge,
      rp: { name: "Coat Rack" },
      // the entire user object comes from the backend, we just do some parsing here
      // this is the same object that passport uses to hold the user reference
      user: {
        id: userId,
        name,
        displayName,
      },
      pubKeyCredParams: [
        {
          type: "public-key",
          alg: -7, // ES256
        },
        {
          type: "public-key",
          alg: -257, // RS256
        },
        {
          type: "public-key",
          alg: -8, // Ed25519
        },
      ],
    },
  }) as Promise<PublicKeyCredential | null>
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

  const logIn = (name: string) => trpcClient.auth.login.query({ name })
  const signUp = async (name: string) => {
    const challengeResponse = await fetch(
      new URL("/register/public-key/challenge", getServerUrl()),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          displayName: name,
        }),
      },
    )

    const challengeJson = await challengeResponse.json()
    const rpId = challengeJson.rpId
    const challenge = new Uint8Array(challengeJson.challenge.data)
    const userId = new Uint8Array(challengeJson.user.id.data)

    console.log(challengeJson)

    const credential = await createCredentials(
      rpId,
      userId,
      challengeJson.user.name,
      challengeJson.user.displayName,
      challenge,
    )

    if (!credential) {
      throw new Error("Credential creation failed")
    }

    console.log(challenge, credential)

    // convert buffers in some predictable way
    const jsonCredential = JSON.parse(JSON.stringify(credential))
    const registerResponse = await fetch(
      new URL("/login/public-key", getServerUrl()),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          response: {
            clientDataJSON: encodeURIComponent(
              jsonCredential.response.clientDataJSON,
            ),
            attestationObject: encodeURIComponent(
              jsonCredential.response.attestationObject,
            ),
          },
        }),
      },
    )

    const loginJson = await registerResponse.json()

    console.log(loginJson)

    // trpcClient.auth.register.mutate({ name })

    throw new Error("challenge in progress")
  }

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
