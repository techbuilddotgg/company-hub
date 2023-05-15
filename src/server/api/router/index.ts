import { t } from '../trpc';
import { usersRouter } from '@server/api/router/users';
import { boardRouter } from '@server/api/router/board';
import { projectRouter } from '@server/api/router/project';
import { eventRouter } from '@server/api/router/events';

export const appRouter = t.router({
  users: usersRouter,
  board: boardRouter,
  project: projectRouter,
  event: eventRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
