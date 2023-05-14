import { protectedProcedure, t } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

const projectBoardTasksSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  projectBoardColumnId: z.string(),
  createdAt: z.date(),
  taskPriorityId: z.string().nullable(),
  taskTypeId: z.string().nullable(),
});

export const projectBoardColumnSchema = z.object({
  id: z.string(),
  name: z.string(),
  projectBoardId: z.string(),
  projectBoardCard: z.array(projectBoardTasksSchema),
});

export const projectBoardSchema = z.object({
  id: z.string(),
  name: z.string(),
  projectId: z.string(),
  projectBoardColumn: z.array(projectBoardColumnSchema),
});

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
            projectBoardColumns: {
              include: {
                projectBoardTasks: true,
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
  updateBoard: protectedProcedure
    .input(projectBoardSchema)
    .mutation(async ({ input }) => {
      try {
        await prisma?.projectBoard.update({
          where: {
            id: input.id,
          },
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
        await prisma?.projectBoardTask.create({
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
  updateTask: protectedProcedure
    .input(projectBoardTasksSchema)
    .mutation(async ({ input }) => {
      try {
        await prisma?.projectBoardTask.update({
          where: {
            id: input.id,
          },
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
