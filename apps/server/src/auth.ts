import WebAuthnStrategy, {
  SessionChallengeStore,
  type RegisterFunction,
  type VerifyFunction,
} from "passport-fido2-webauthn"

import { Passport } from "passport"
import { DB } from "./db"

function verifyCredential(db: DB): VerifyFunction {
  return () => {}
}

function registerCredential(db: DB): RegisterFunction {
  return async () => {}
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
