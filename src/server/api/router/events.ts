import { protectedProcedure, t } from '../trpc';
import { TRPCError } from '@trpc/server';
import { AddEventSchema } from '../../../shared/validators/calendar.schemas';

export const eventRouter = t.router({
  get: protectedProcedure.query(async ({ ctx: { prisma, authedUserId } }) => {
    try {
      return await prisma.event.findMany({
        where: {
          authorId: authedUserId,
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
    .input(AddEventSchema)
    .mutation(async ({ input, ctx: { prisma, authedUserId } }) => {
      try {
        await prisma.event.create({
          data: {
            title: input.title,
            description: input.description,
            start: input.start,
            end: input.end,
            backgroundColor: input.backgroundColor,
            authorId: authedUserId,
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
});
