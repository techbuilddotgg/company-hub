// src/server/router/index.ts
import { t } from '../trpc';

import { usersRouter } from '@server/api/router/users';
import { boardRouter } from '@server/api/router/board';
import { projectRouter } from '@server/api/router/project';

export const appRouter = t.router({
  users: usersRouter,
  board: boardRouter,
  project: projectRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
