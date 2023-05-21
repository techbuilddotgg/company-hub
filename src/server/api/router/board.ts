import { protectedProcedure, t } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import {
  projectBoardColumnSchema,
  projectBoardTaskSchema,
} from '../../../shared/validators/board.schemes';

export const boardRouter = t.router({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        return await ctx.prisma.projectBoard.findUnique({
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
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.projectBoard.create({
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
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        projectId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.projectBoard.update({
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
  getColumns: protectedProcedure
    .input(z.object({ boardId: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        return await ctx.prisma.projectBoardColumn.findMany({
          where: { projectBoardId: input.boardId },
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
    .mutation(async ({ input, ctx }) => {
      try {
        const board = await ctx.prisma.projectBoard.findUnique({
          where: { id: input.boardId },
          include: { projectBoardColumns: true },
        });
        if (!board)
          throw new TRPCError({
            message: 'Board not found',
            code: 'INTERNAL_SERVER_ERROR',
          });
        await ctx.prisma.projectBoardColumn.create({
          data: {
            name: input.name,
            projectBoardId: input.boardId,
            orderIndex: board.projectBoardColumns.length,
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
  updateColumn: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.projectBoardColumn.update({
          where: { id: input.id },
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
  deleteColumn: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.$transaction(async (tx) => {
          const deleted = await tx.projectBoardColumn.delete({
            where: { id: input.id },
          });
          await tx.projectBoard.update({
            where: { id: deleted.projectBoardId },
            data: {
              projectBoardColumns: {
                updateMany: {
                  where: {
                    orderIndex: {
                      gt: deleted.orderIndex,
                    },
                  },
                  data: {
                    orderIndex: {
                      decrement: 1,
                    },
                  },
                },
              },
            },
          });
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
    .mutation(async ({ input, ctx }) => {
      try {
        const column = await ctx.prisma.projectBoardColumn.findUnique({
          where: { id: input.columnId },
          include: { projectBoardTasks: true },
        });
        if (!column)
          throw new TRPCError({
            message: 'Column not found',
            code: 'INTERNAL_SERVER_ERROR',
          });
        await ctx.prisma.projectBoardTask.create({
          data: {
            name: input.name,
            projectBoardColumnId: input.columnId,
            orderIndex: column.projectBoardTasks.length,
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
    .input(projectBoardTaskSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.projectBoardTask.update({
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
  reorderColumns: protectedProcedure
    .input(
      z.object({
        boardId: z.string(),
        columns: z.array(projectBoardColumnSchema),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.projectBoard.update({
          where: {
            id: input.boardId,
          },
          data: {
            projectBoardColumns: {
              updateMany: input.columns.map((column, index) => ({
                where: { id: column.id },
                data: { orderIndex: index },
              })),
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
  reorderTasksInColumn: protectedProcedure
    .input(
      z.object({
        columnId: z.string(),
        tasks: z.array(projectBoardTaskSchema),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.projectBoardColumn.update({
          where: {
            id: input.columnId,
          },
          data: {
            projectBoardTasks: {
              updateMany: input.tasks.map((task, index) => ({
                where: { id: task.id },
                data: { orderIndex: index },
              })),
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
  moveTask: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        targetOrderIndex: z.number(),
        sourceOrderIndex: z.number(),
        sourceColumnId: z.string(),
        targetColumnId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        console.log(input);
        await ctx.prisma.$transaction([
          ctx.prisma.projectBoardColumn.update({
            where: {
              id: input.sourceColumnId,
            },
            data: {
              projectBoardTasks: {
                updateMany: {
                  where: {
                    orderIndex: {
                      gt: input.sourceOrderIndex,
                    },
                  },
                  data: {
                    orderIndex: {
                      decrement: 1,
                    },
                  },
                },
              },
            },
          }),
          ctx.prisma.projectBoardColumn.update({
            where: {
              id: input.targetColumnId,
            },
            data: {
              projectBoardTasks: {
                updateMany: {
                  where: {
                    orderIndex: {
                      gte: input.targetOrderIndex,
                    },
                  },
                  data: {
                    orderIndex: {
                      increment: 1,
                    },
                  },
                },
              },
            },
          }),
          ctx.prisma.projectBoardTask.update({
            where: {
              id: input.taskId,
            },
            data: {
              projectBoardColumnId: input.targetColumnId,
              orderIndex: input.targetOrderIndex,
            },
          }),
        ]);
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          message: 'Something went wrong. Please try again later.',
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    }),
  updateTasks: protectedProcedure
    .input(z.array(projectBoardTaskSchema))
    .mutation(async ({ input, ctx }) => {
      try {
        await Promise.all(
          input.map((task) =>
            ctx.prisma.projectBoardTask.update({
              where: {
                id: task.id,
              },
              data: task,
            }),
          ),
        );
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          message: 'Something went wrong. Please try again later.',
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    }),
  deleteTask: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.$transaction(async (tx) => {
          const deletedTask = await tx.projectBoardTask.delete({
            where: {
              id: input,
            },
          });
          await tx.projectBoardColumn.update({
            where: { id: deletedTask.projectBoardColumnId },
            data: {
              projectBoardTasks: {
                updateMany: {
                  where: {
                    orderIndex: {
                      gt: deletedTask.orderIndex,
                    },
                  },
                  data: {
                    orderIndex: {
                      decrement: 1,
                    },
                  },
                },
              },
            },
          });
        });
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          message: 'Something went wrong. Please try again later.',
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    }),
  addUserToTask: protectedProcedure
    .input(z.object({ userId: z.string(), taskId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.projectBoardTaskUser.create({
          data: {
            userId: input.userId,
            projectBoardTaskId: input.taskId,
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
  getUsersAssignedToTask: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        const users = await ctx.prisma.projectBoardTaskUser.findMany({
          where: {
            projectBoardTaskId: input.taskId,
          },
        });
        return users.map((user) => user.userId);
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          message: 'Something went wrong. Please try again later.',
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    }),
  removeUserFromTask: protectedProcedure
    .input(z.object({ userId: z.string(), taskId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.projectBoardTaskUser.deleteMany({
          where: { userId: input.userId, projectBoardTaskId: input.taskId },
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
