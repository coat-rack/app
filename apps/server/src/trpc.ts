import { User } from "@coat-rack/core/models"
import { initTRPC, TRPCError } from "@trpc/server"

interface TRPCContext {
  user?: User
}

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<TRPCContext>().create()

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router

/**
 * Used for any methods that should be allowed by unauthorized users
 */
export const publicProcedure = t.procedure

/**
 * Procedures based on this will check if the user is authorized before proceeding
 */
export const authedProcedure = t.procedure.use(function ensureAuthed(opts) {
  const { ctx } = opts

  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not logged in",
    })
  }

  return opts.next({
    ctx: {
      user: ctx.user,
    },
  })
})
