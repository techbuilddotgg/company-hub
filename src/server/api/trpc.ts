import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './context';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { clerkClient } from '@clerk/nextjs/server';
import pusher from '@utils/pusher';

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

const isAuthed = t.middleware(async ({ next, ctx }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      authedUserId: ctx.userId,
    },
  });
});

const triggerBoardRefetch = t.middleware(async ({ next }) => {
  pusher.trigger('my-channel', 'my-event', {});
  return next();
});

const isAdmin = t.middleware(async ({ next, ctx }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  const user = await clerkClient.users.getUser(ctx.userId);

  if (!user.publicMetadata.isAdmin) {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }

  return next({
    ctx: {
      authedUserId: user.id,
      companyId: user.publicMetadata.companyId as string | undefined,
    },
  });
});

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const boardProcedure = protectedProcedure.use(triggerBoardRefetch);
export const adminProcedure = t.procedure.use(isAdmin);
export const adminBoardProcedure = adminProcedure.use(triggerBoardRefetch);
