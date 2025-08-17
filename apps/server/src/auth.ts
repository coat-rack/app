import WebAuthnStrategy, {
  SessionChallengeStore,
  type RegisterFunction,
  type VerifyFunction,
} from "passport-fido2-webauthn"

import { Passport } from "passport"
import { DB } from "./db"

function verifyCredential(db: DB): VerifyFunction {
  return (...args) => {
    console.log("Running verifyCredential")
    console.log(args)
    console.log("After verifyCredential")
  }
}

function registerCredential(db: DB): RegisterFunction {
  return async () => {
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
