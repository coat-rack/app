// Based on the implementation here: https://divrhino.com/articles/passkeys-express
// And the relevant passport docs: https://www.passportjs.org/packages/passport-fido2-webauthn/

import WebAuthnStrategy, {
  RegisteredFunction,
  SessionChallengeStore,
  VerifiedFunction,
  type RegisterFunction,
  type VerifyFunction,
} from "passport-fido2-webauthn"

import { User } from "@coat-rack/core/models"
import { Passport } from "passport"
import { DB, UserCredential } from "./db"

function verifyCredential(db: DB): VerifyFunction {
  return async (id: string, userHandle: Buffer, verified: VerifiedFunction) => {
    console.log("Running verifyCredential")
    console.log(db, id, userHandle, verified)
    console.log("After verifyCredential")

    const userCredential = await db.userCredentials.get(id)
    if (!userCredential) {
      const message = `User not found: ${id}`

      return verified(undefined, undefined, { message })
    }

    const foundKey = userCredential.publicKeys
      .map((k) => Buffer.from(k.buffer.data))
      .find((key) => userHandle.equals(key))

    if (!foundKey) {
      const message = `Failed to verify credential for user: ${id}`

      return verified(undefined, undefined, { message })
    }

    // not sure what we need to return here
    // also unclear about how/where we're going from public key to buffer/vice versa
    return verified(undefined, id, foundKey.toString())
  }
}

function registerCredential(db: DB): RegisterFunction {
  return async (
    user: { name: string; id: Buffer },
    credentialId: string,
    publicKey: string,
    registered: RegisteredFunction,
  ) => {
    console.log("Running registerCredential")

    const userId = new TextDecoder().decode(user.id)
    console.log({ user, id: credentialId, publicKey, userId })
    console.log("After registerCredential")

    const newUser: User = {
      type: "user",
      id: userId,
      name: user.name,
      timestamp: Date.now(),
    }

    await db.users.putItems([newUser])
    const existingCredential = await db.userCredentials.get(userId)

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

    return registered(undefined, {
      id: userId,
      username: user.name,
      name: user.name,
    })
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
  passport.serializeUser((user) => user)
  passport.deserializeUser((user) => user)

  return {
    store,
    passport,
  }
}
