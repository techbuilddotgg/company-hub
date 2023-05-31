import {
  adminBoardProcedure,
  boardProcedure,
  protectedProcedure,
  t,
} from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import {
  AddColumnSchema,
  projectBoardColumnSchema,
  projectBoardTaskSchema,
  projectBoardTaskSchemaOptional,
} from '@shared/validators/board.schemes';
import { clerkClient } from '@clerk/nextjs/server';
import { GithubBranch } from '@shared/types/github.types';
import { getTaskTagFromFullBranchName } from '@utils/github';
import { errorHandler } from '@utils/error-handler';
import { capitalize } from '@utils/capitalize';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

export const boardRouter = t.router({
  getById: protectedProcedure.input(z.object({ id: z.string() })).query(
    errorHandler(async ({ input, ctx }) => {
      const projectBoard = await ctx.prisma.projectBoard.findUnique({
        where: {
          id: input.id,
        },
        include: {
          projectBoardColumns: {
            include: {
              projectBoardTasks: {
                include: {
                  users: true,
                },
              },
            },
          },
        },
      });

      if (!projectBoard) return null;
      const githubData = await ctx.prisma.githubData.findFirst({
        where: { projectBoardId: input.id },
      });

      if (!githubData)
        return {
          ...projectBoard,
          projectBoardColumns:
            projectBoard?.projectBoardColumns.map((column) => {
              return {
                ...column,
                projectBoardTasks: column.projectBoardTasks.map((task) => {
                  return {
                    ...task,
                    connectedBranch: null,
                  };
                }),
              };
            }) || [],
        };

      const tokenResponse = await clerkClient.users.getUserOauthAccessToken(
        ctx.authedUserId,
        'oauth_github',
      );
      if (!tokenResponse || tokenResponse.length === 0)
        return {
          ...projectBoard,
          projectBoardColumns:
            projectBoard?.projectBoardColumns.map((column) => {
              return {
                ...column,
                projectBoardTasks: column.projectBoardTasks.map((task) => {
                  return {
                    ...task,
                    connectedBranch: null,
                  };
                }),
              };
            }) || [],
        };

      const branchesResponse = await fetch(
        `https://api.github.com/repos/${githubData.owner}/${githubData.repository}/branches`,
        {
          headers: {
            Authorization: `Bearer ${tokenResponse[0]?.token}`,
          },
        },
      );
      const branches: GithubBranch[] = await branchesResponse.json();

      return {
        ...projectBoard,
        projectBoardColumns:
          projectBoard?.projectBoardColumns.map((column) => {
            return {
              ...column,
              projectBoardTasks: column.projectBoardTasks.map((task) => {
                return {
                  ...task,
                  connectedBranch:
                    branches.find(
                      (branch) =>
                        task.tag === getTaskTagFromFullBranchName(branch.name),
                    )?.name || null,
                };
              }),
            };
          }) || [],
      };
    }),
  ),
  addBoard: protectedProcedure
    .input(z.object({ name: z.string(), projectId: z.string() }))
    .mutation(
      errorHandler(async ({ input, ctx }) => {
        const board = await ctx.prisma.projectBoard.create({
          data: {
            name: input.name,
            projectId: input.projectId,
          },
        });

        return {
          message: {
            title: 'Board added',
            description: 'Board was added successfully.',
          },
          data: board,
        };
      }),
    ),
  updateBoard: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        projectId: z.string(),
      }),
    )
    .mutation(
      errorHandler(async ({ input, ctx }) => {
        const board = await ctx.prisma.projectBoard.update({
          where: {
            id: input.id,
          },
          data: input,
        });

        return {
          message: {
            title: 'Board updated',
            description: 'Board was updated successfully.',
          },
          data: board,
        };
      }),
    ),
  getColumns: protectedProcedure.input(z.object({ boardId: z.string() })).query(
    errorHandler(async ({ input, ctx }) => {
      return await ctx.prisma.projectBoardColumn.findMany({
        where: { projectBoardId: input.boardId },
      });
    }),
  ),
  addColumn: adminBoardProcedure
    .input(AddColumnSchema.extend({ boardId: z.string() }))
    .mutation(
      errorHandler(async ({ input, ctx }) => {
        const board = await ctx.prisma.projectBoard.findUnique({
          where: { id: input.boardId },
          include: { projectBoardColumns: true },
        });
        if (!board)
          throw new TRPCError({
            message: 'Board not found',
            code: 'INTERNAL_SERVER_ERROR',
          });
        try {
          const column = await ctx.prisma.projectBoardColumn.create({
            data: {
              name: capitalize(input.name),
              projectBoardId: input.boardId,
              orderIndex: board.projectBoardColumns.length,
            },
          });
          return {
            message: {
              title: 'Column added',
              description: 'Column was added successfully.',
            },
            data: column,
          };
        } catch (e) {
          if (
            e instanceof PrismaClientKnownRequestError &&
            e.code === 'P2002'
          ) {
            throw new TRPCError({
              message: `Column with name "${input.name}" already exists`,
              code: 'BAD_REQUEST',
            });
          }
          throw e;
        }
      }),
    ),
  updateColumn: adminBoardProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(
      errorHandler(async ({ input, ctx }) => {
        const column = await ctx.prisma.projectBoardColumn.findUnique({
          where: { id: input.id },
          include: {
            projectBoard: true,
          },
        });

        if (!column)
          throw new TRPCError({
            message: 'Column not found',
            code: 'INTERNAL_SERVER_ERROR',
          });

        return await ctx.prisma.$transaction(async (tx) => {
          const updatedColumn = await tx.projectBoardColumn.update({
            where: { id: input.id },
            data: input,
          });
          await tx.githubWebhookAction.updateMany({
            where: {
              projectBoardColumnName: column.name,
              githubData: { projectBoard: { id: column.projectBoard.id } },
            },
            data: {
              projectBoardColumnName: updatedColumn.name,
            },
          });
          return {
            message: {
              title: 'Column updated',
              description: 'Column was updated successfully.',
            },
            data: updatedColumn,
          };
        });
      }),
    ),
  deleteColumn: adminBoardProcedure
    .input(z.object({ id: z.string() }))
    .mutation(
      errorHandler(async ({ input, ctx }) => {
        const deleted = await ctx.prisma.$transaction(async (tx) => {
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
          return deleted;
        });

        return {
          message: {
            title: 'Column deleted',
            description: 'Column was deleted successfully.',
          },
          data: deleted,
        };
      }),
    ),
  addTask: boardProcedure
    .input(z.object({ name: z.string(), columnId: z.string() }))
    .mutation(
      errorHandler(async ({ input, ctx }) => {
        const projectBoard = await ctx.prisma.projectBoard.findFirst({
          where: {
            projectBoardColumns: {
              some: {
                id: input.columnId,
              },
            },
          },
          include: {
            project: true,
            projectBoardColumns: { include: { projectBoardTasks: true } },
          },
        });
        if (!projectBoard)
          throw new TRPCError({
            message: 'Board not found',
            code: 'INTERNAL_SERVER_ERROR',
          });
        const tasks = projectBoard.projectBoardColumns.flatMap((column) => [
          ...column.projectBoardTasks,
        ]);
        const maxTaskTagCode = tasks.reduce((maxTagCode, current) => {
          const tagCode = current.tag.split('-')[1];
          if (!tagCode) return maxTagCode;
          if (parseInt(tagCode) > maxTagCode) return parseInt(tagCode);
          return maxTagCode;
        }, 0);

        const column = await ctx.prisma.projectBoardColumn.findUnique({
          where: { id: input.columnId },
          include: { projectBoardTasks: true },
        });
        if (!column)
          throw new TRPCError({
            message: 'Column not found',
            code: 'INTERNAL_SERVER_ERROR',
          });

        const task = await ctx.prisma.projectBoardTask.create({
          data: {
            name: input.name,
            projectBoardColumnId: input.columnId,
            orderIndex: column.projectBoardTasks.length,
            tag: `${projectBoard.project.abbreviation}-${maxTaskTagCode + 1}`,
          },
        });

        return {
          message: {
            title: 'Task added',
            description: 'Task was added successfully.',
          },
          data: task,
        };
      }),
    ),
  getTask: protectedProcedure.input(z.object({ taskId: z.string() })).query(
    errorHandler(async ({ input, ctx }) => {
      return await ctx.prisma.projectBoardTask.findUnique({
        where: {
          id: input.taskId,
        },
      });
    }),
  ),
  updateTask: boardProcedure.input(projectBoardTaskSchemaOptional).mutation(
    errorHandler(async ({ input, ctx }) => {
      const task = await ctx.prisma.projectBoardTask.update({
        where: {
          id: input.id,
        },
        data: input,
      });
      return {
        message: {
          title: 'Task updated',
          description: `Task ${task.name} updated successfully.`,
        },
        data: task,
      };
    }),
  ),
  reorderColumns: adminBoardProcedure
    .input(
      z.object({
        boardId: z.string(),
        columns: z.array(projectBoardColumnSchema),
      }),
    )
    .mutation(
      errorHandler(async ({ input, ctx }) => {
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
      }),
    ),
  reorderTasksInColumn: boardProcedure
    .input(
      z.object({
        columnId: z.string(),
        tasks: z.array(projectBoardTaskSchema),
      }),
    )
    .mutation(
      errorHandler(async ({ input, ctx }) => {
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
      }),
    ),
  moveTask: boardProcedure
    .input(
      z.object({
        taskId: z.string(),
        targetOrderIndex: z.number(),
        sourceOrderIndex: z.number(),
        sourceColumnId: z.string(),
        targetColumnId: z.string(),
      }),
    )
    .mutation(
      errorHandler(async ({ input, ctx }) => {
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
      }),
    ),
  updateTasks: boardProcedure.input(z.array(projectBoardTaskSchema)).mutation(
    errorHandler(async ({ input, ctx }) => {
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
    }),
  ),
  deleteTask: boardProcedure.input(z.string()).mutation(
    errorHandler(async ({ input, ctx }) => {
      const deleted = await ctx.prisma.$transaction(async (tx) => {
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
        return deletedTask;
      });
      return {
        message: {
          title: 'Task deleted',
          description: 'task was deleted successfully.',
        },
        data: deleted,
      };
    }),
  ),
  addUserToTask: protectedProcedure
    .input(z.object({ userId: z.string(), taskId: z.string() }))
    .mutation(
      errorHandler(async ({ input, ctx }) => {
        const taskUser = await ctx.prisma.projectBoardTaskUser.create({
          data: {
            userId: input.userId,
            projectBoardTaskId: input.taskId,
          },
        });
        return {
          message: {
            title: 'User assigned to task',
            description: 'User assigned to task successfully.',
          },
          data: taskUser,
        };
      }),
    ),
  getUsersAssignedToTask: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .query(
      errorHandler(async ({ input, ctx }) => {
        const users = await ctx.prisma.projectBoardTaskUser.findMany({
          where: {
            projectBoardTaskId: input.taskId,
          },
        });
        return users.map((user) => user.userId);
      }),
    ),
  removeUserFromTask: protectedProcedure
    .input(z.object({ userId: z.string(), taskId: z.string() }))
    .mutation(
      errorHandler(async ({ input, ctx }) => {
        const userTask = await ctx.prisma.projectBoardTaskUser.deleteMany({
          where: { userId: input.userId, projectBoardTaskId: input.taskId },
        });
        return {
          message: {
            title: 'User removed from task',
            description: 'User removed from task successfully.',
          },
          data: userTask,
        };
      }),
    ),
  commentTask: protectedProcedure
    .input(
      z.object({
        comment: z.string(),
        taskId: z.string(),
        userId: z.string(),
        email: z.string(),
      }),
    )
    .mutation(
      errorHandler(async ({ input, ctx }) =>
        ctx.prisma.projectBoardTaskComment.create({
          data: {
            text: input.comment,
            projectBoardTaskId: input.taskId,
            authorId: input.userId,
            email: input.email,
          },
        }),
      ),
    ),
  getTaskComments: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .query(
      errorHandler(async ({ input, ctx }) =>
        ctx.prisma.projectBoardTaskComment.findMany({
          where: {
            projectBoardTaskId: input.taskId,
          },
        }),
      ),
    ),
  getTaskTypes: protectedProcedure.query(
    errorHandler(async ({ ctx }) => ctx.prisma.taskType.findMany({})),
  ),
  getTaskType: protectedProcedure
    .input(z.object({ taskTypeId: z.string() }))
    .query(
      errorHandler(async ({ input, ctx }) =>
        ctx.prisma.taskType.findUnique({
          where: {
            id: input.taskTypeId,
          },
        }),
      ),
    ),
  getTaskPriorities: protectedProcedure.query(
    errorHandler(async ({ ctx }) => ctx.prisma.taskPriority.findMany({})),
  ),
  getTaskPriority: protectedProcedure
    .input(z.object({ taskPriorityId: z.string() }))
    .query(
      errorHandler(async ({ input, ctx }) =>
        ctx.prisma.taskPriority.findUnique({
          where: {
            id: input.taskPriorityId,
          },
        }),
      ),
    ),
});
