import { protectedProcedure, t } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { EventSchema } from '@shared/validators/calendar.schemas';
import { errorHandler } from '@utils/error-handler';

export const eventRouter = t.router({
  get: protectedProcedure.query(
    errorHandler(async ({ ctx: { prisma, authedUserId } }) =>
      prisma.event.findMany({
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
        include: {
          users: true,
        },
      }),
    ),
  ),
  add: protectedProcedure.input(EventSchema).mutation(
    errorHandler(async ({ input, ctx: { prisma, authedUserId } }) => {
      const event = await prisma.event.create({
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

      return {
        message: {
          title: 'Event added successfully.',
          description: 'Event has been added to your calendar.',
        },
        data: event,
      };
    }),
  ),
  update: protectedProcedure.input(EventSchema).mutation(
    errorHandler(async ({ input, ctx: { prisma, authedUserId } }) => {
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
      const updatedEvent = await prisma.event.update({
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
      return {
        message: {
          title: 'Event updated successfully.',
          description: 'Event has been updated in your calendar.',
        },
        data: updatedEvent,
      };
    }),
  ),
  updateByTaskId: protectedProcedure.input(EventSchema).mutation(
    errorHandler(async ({ input, ctx: { prisma } }) => {
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
      const updatedEvent = await prisma.event.update({
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
      return {
        message: {
          title: 'Event updated successfully.',
          description: 'Event has been updated in your calendar.',
        },
        data: updatedEvent,
      };
    }),
  ),
  delete: protectedProcedure.input(z.string()).mutation(
    errorHandler(async ({ input, ctx: { prisma } }) => {
      const deletedEvent = await prisma.event.delete({
        where: {
          id: input,
        },
      });
      return {
        message: {
          title: 'Event deleted successfully.',
          description: 'Event has been deleted from your calendar.',
        },
        data: deletedEvent,
      };
    }),
  ),
  deleteByTaskId: protectedProcedure.input(z.string()).mutation(
    errorHandler(async ({ input, ctx: { prisma } }) => {
      const deletedEvent = await prisma.event.deleteMany({
        where: {
          taskId: input,
        },
      });
      return {
        message: {
          title: 'Event deleted successfully.',
          description: 'Event has been deleted from your calendar.',
        },
        data: deletedEvent,
      };
    }),
  ),
  getEventUsers: protectedProcedure.input(z.string()).query(
    errorHandler(async ({ input, ctx: { prisma } }) =>
      prisma.event.findUnique({
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
      }),
    ),
  ),
});
