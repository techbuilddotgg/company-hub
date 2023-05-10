// src/server/router/index.ts
import { t } from '../trpc';

import { usersRouter } from '@server/api/router/users';

export const appRouter = t.router({
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
