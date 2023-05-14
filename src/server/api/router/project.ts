import { protectedProcedure, t } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const projectRouter = t.router({
  add: protectedProcedure
    .input(z.object({ name: z.string(), boardName: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const project = await prisma?.project.create({
          data: {
            name: input.name,
            companyId: ctx.user.privateMetadata.companyId as string,
          },
        });
        await prisma?.projectBoard.create({
          data: { name: input.boardName, projectId: project?.id as string },
        });
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          message: 'Something went wrong. Please try again later.',
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    }),
  get: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await prisma?.project.findMany({
        where: {
          companyId: ctx.user.privateMetadata.companyId as string,
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
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        return await prisma?.project.findUnique({
          where: {
            id: input.id,
          },
          include: {
            projectBoards: true,
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
