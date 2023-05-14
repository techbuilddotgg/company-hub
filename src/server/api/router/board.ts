import { protectedProcedure, t } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const boardRouter = t.router({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        return await prisma?.projectBoard.findUnique({
          where: {
            id: input.id,
          },
          include: {
            ProjectBoardColumn: {
              include: {
                projectBoardCard: true,
              },
            },
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
  addBoard: protectedProcedure
    .input(z.object({ name: z.string(), projectId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await prisma?.projectBoard.create({
          data: {
            name: input.name,
            projectId: input.projectId,
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
  addColumn: protectedProcedure
    .input(z.object({ name: z.string(), boardId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await prisma?.projectBoardColumn.create({
          data: {
            name: input.name,
            projectBoardId: input.boardId,
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
  addTask: protectedProcedure
    .input(z.object({ name: z.string(), columnId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await prisma?.projectBoardTasks.create({
          data: {
            name: input.name,
            projectBoardColumnId: input.columnId,
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
