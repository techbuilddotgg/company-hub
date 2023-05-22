import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './context';
import superjson from 'superjson';
import { ZodError } from 'zod';
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

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const boardProcedure = protectedProcedure.use(triggerBoardRefetch);
