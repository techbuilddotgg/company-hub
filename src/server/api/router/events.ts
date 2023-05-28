import { protectedProcedure, t } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { EventSchema } from '@shared/validators/calendar.schemas';

export const eventRouter = t.router({
  get: protectedProcedure.query(async ({ ctx: { prisma, authedUserId } }) => {
    try {
      return await prisma.event.findMany({
        where: {
          OR: [
            {
              authorId: authedUserId,
            },
            {
              users: {
                some: {
                  userId: authedUserId,
                },
              },
            },
          ],
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
    .input(EventSchema)
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
            users: { create: input.users.map((userId) => ({ userId })) },
            taskId: input.taskId,
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
  update: protectedProcedure
    .input(EventSchema)
    .mutation(async ({ input, ctx: { prisma, authedUserId } }) => {
      try {
        const existingEvent = await prisma.event.findUnique({
          where: {
            id: input.id,
          },
          include: {
            users: true,
          },
        });
        if (!existingEvent) {
          throw new TRPCError({
            message: 'Event not found.',
            code: 'NOT_FOUND',
          });
        }
        if (existingEvent.authorId !== authedUserId) {
          throw new TRPCError({
            message: 'You are not authorized to update this event.',
            code: 'UNAUTHORIZED',
          });
        }
        await prisma.event.update({
          where: {
            id: input.id,
          },
          data: {
            title: input.title,
            description: input.description,
            start: input.start,
            end: input.end,
            backgroundColor: input.backgroundColor,
            users: {
              deleteMany: {},
              create: input.users.map((userId) => ({ userId })),
            },
            taskId: input.taskId,
          },
        });
        return true;
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          message: 'Something went wrong. Please try again later.',
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    }),
  updateByTaskId: protectedProcedure
    .input(EventSchema)
    .mutation(async ({ input, ctx: { prisma } }) => {
      try {
        const existingEvent = await prisma.event.findFirst({
          where: {
            taskId: input.taskId,
          },
          include: {
            users: true,
          },
        });
        if (!existingEvent) {
          throw new TRPCError({
            message: 'Event not found.',
            code: 'NOT_FOUND',
          });
        }
        await prisma.event.update({
          where: {
            id: existingEvent.id,
          },
          data: {
            title: input.title,
            description: input.description,
            start: input.start,
            end: input.end,
            backgroundColor: input.backgroundColor,
            users: {
              deleteMany: {},
              create: input.users.map((userId) => ({ userId })),
            },
            taskId: input.taskId,
          },
        });
        return true;
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          message: 'Something went wrong. Please try again later.',
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx: { prisma } }) => {
      try {
        await prisma.event.delete({
          where: {
            id: input,
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
  deleteByTaskId: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx: { prisma } }) => {
      try {
        await prisma.event.deleteMany({
          where: {
            taskId: input,
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
  getEventUsers: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx: { prisma } }) => {
      try {
        return await prisma.event.findUnique({
          where: {
            id: input,
          },
          select: {
            users: {
              select: {
                userId: true,
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
});
