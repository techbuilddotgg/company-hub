import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter } from '@server/api/router';
import { createContext } from '@server/api/context';
import { env } from '@env';

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError:
    env.NODE_ENV === 'development'
      ? ({ path, error }) => {
          console.error(`❌ tRPC failed on ${path}: ${error}`);
        }
      : undefined,
});
