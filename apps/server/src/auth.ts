// Based on the implementation here: https://divrhino.com/articles/passkeys-express
// And the relevant passport docs: https://www.passportjs.org/packages/passport-fido2-webauthn/

import WebAuthnStrategy, {
  SessionChallengeStore,
  VerifiedFunction,
  type RegisterFunction,
  type VerifyFunction,
} from "passport-fido2-webauthn"

import { Passport } from "passport"
import { DB } from "./db"

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
  return async (...args) => {
    console.log("Running registerCredential")
    console.log(args)
    console.log("After registerCredential")
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

  return {
    store,
    passport,
  }
}
