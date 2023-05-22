import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { prisma } from '../db/client';
import { getAuth } from '@clerk/nextjs/server';

type CreateContextOptions = {
  userId: string | null;
};

export const createContextInner = ({ userId }: CreateContextOptions) => {
  return {
    userId,
    prisma,
  };
};

export const createContext = async (
  opts: trpcNext.CreateNextContextOptions,
) => {
  const { req } = opts;
  const sesh = getAuth(req);

  const userId = sesh.userId;

  return createContextInner({ userId });
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
