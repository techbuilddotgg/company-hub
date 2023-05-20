import { t } from '../trpc';
import { usersRouter } from '@server/api/router/users';
import { boardRouter } from '@server/api/router/board';
import { projectRouter } from '@server/api/router/project';
import { githubRouter } from '@server/api/router/github';

export const appRouter = t.router({
  users: usersRouter,
  board: boardRouter,
  project: projectRouter,
  github: githubRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
