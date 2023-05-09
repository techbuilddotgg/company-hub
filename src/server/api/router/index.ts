// src/server/router/index.ts
import { t } from "../trpc";

import { exampleRouter } from "./example";
import { userRouter } from "@server/api/router/user";

export const appRouter = t.router({
  example: exampleRouter,
  user: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
