import { t } from '../trpc';
import { usersRouter } from '@server/api/router/users';
import { boardRouter } from '@server/api/router/board';
import { projectRouter } from '@server/api/router/project';
import { githubRouter } from '@server/api/router/github';
import { eventRouter } from '@server/api/router/events';
import { knowledgeBaseRouter } from '@server/api/router/knowledge-base';
import { companyRouter } from '@server/api/router/company';

export const appRouter = t.router({
  users: usersRouter,
  board: boardRouter,
  project: projectRouter,
  event: eventRouter,
  knowledgeBase: knowledgeBaseRouter,
  github: githubRouter,
  company: companyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
