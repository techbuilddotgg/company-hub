import { protectedProcedure, t } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const eventSchema = z.object({
  title: z.string(),
  start: z.string(),
  end: z.string(),
  authorId: z.string(),
});

export const eventRouter = t.router({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx: { prisma } }) => {
      try {
        return await prisma.event.findMany({
          where: {
            authorId: input.id,
          },
        });
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          message: 'Something went wrong. Please try again later.',
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    }),
  add: protectedProcedure
    .input(eventSchema)
    .mutation(async ({ input, ctx: { prisma } }) => {
      try {
        await prisma.event.create({
          data: input,
        });
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          message: 'Something went wrong. Please try again later.',
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    }),
});
