import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { prisma } from '../db/client';
import { getAuth } from '@clerk/nextjs/server';

export const createContextInner = (opts: trpcNext.CreateNextContextOptions) => {
  const { req } = opts;
  const sesh = getAuth(req);

  const userId = sesh.userId;
  return {
    userId,
    prisma,
  };
};

export const createContext = async (
  opts: trpcNext.CreateNextContextOptions,
) => {
  return createContextInner(opts);
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
