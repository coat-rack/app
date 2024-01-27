import { publicProcedure, router } from "./trpc"

export const appRouter = router({
  getName: publicProcedure.query(() => {
    return "Server Date Time: " + new Date().toString()
  }),
})
