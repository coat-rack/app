// Based on the implementation here: https://divrhino.com/articles/passkeys-express
// And the relevant passport docs: https://www.passportjs.org/packages/passport-fido2-webauthn/

import WebAuthnStrategy, {
  RegisteredFunction,
  SessionChallengeStore,
  VerifiedFunction,
  type RegisterFunction,
  type VerifyFunction,
} from "passport-fido2-webauthn"

import { Passport } from "passport"
import { DB, UserCredential } from "./db"
import { registerUser } from "./router"

function verifyCredential(db: DB): VerifyFunction {
  return async (id: string, userHandle: Buffer, verified: VerifiedFunction) => {
    console.log("Running verifyCredential")
    console.log(db, id, userHandle, verified)
    console.log("After verifyCredential")

    const userId = new TextDecoder().decode(userHandle)

    const userCredential = await db.userCredentials.get(userId)
    if (!userCredential) {
      const message = `User not found: ${id}`

      return verified(undefined, undefined, { message })
    }

    const foundKey = userCredential.publicKeys.find((key) => key.id === id)

    throw new Error("Not implemented")

    if (!foundKey) {
      const message = `Failed to verify credential for user: ${id}`

      return verified(undefined, undefined, { message })
    }

    // not sure what we need to return here
    // also unclear about how/where we're going from public key to buffer/vice versa
    return verified(undefined, id, foundKey)
  }
}

function registerCredential(db: DB): RegisterFunction {
  return async (
    user: { name: string; id: Buffer },
    credentialId: string,
    publicKey: string,
    registered: RegisteredFunction,
  ) => {
    const userId = new TextDecoder().decode(user.id)

    let dbUser = await db.users.get(userId)
    if (!dbUser) {
      dbUser = await registerUser(db, userId)
    }

    const existingCredential = await db.userCredentials.get(dbUser.id)
    dbUser.id
    const publicKeys = existingCredential?.publicKeys || []
    publicKeys.push({
      id: credentialId,
      key: publicKey,
    })

    const credential: UserCredential = {
      id: userId,
      publicKeys,
      timestamp: Date.now(),
    }

    await db.userCredentials.putItems([credential])

    return registered(null, dbUser)
  }
}

export function createAuthentication(db: DB) {
  const store = new SessionChallengeStore()

  const strategy = new WebAuthnStrategy(
    { store },
    verifyCredential(db),
    registerCredential(db),
  )

  const passport = new Passport()
  passport.use(strategy)
  passport.serializeUser((user, done) => {
    console.log("serialize", user)
    return done(undefined, JSON.stringify(user))
  })
  passport.deserializeUser((user: string, done) => {
    console.log("deserialize", user)
    return done(undefined, JSON.parse(user))
  })

  return {
    store,
    passport,
  }
}
