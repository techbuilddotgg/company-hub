import { adminProcedure, protectedProcedure, t } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { clerkClient } from '@clerk/nextjs/server';
import { projectSchema } from '../../../shared/validators/board.schemes';
import { AddProjectSchema } from '../../../shared/validators/project.schemes';

export const projectRouter = t.router({
  add: adminProcedure
    .input(AddProjectSchema)
    .mutation(async ({ input, ctx: { prisma, authedUserId } }) => {
      const user = await clerkClient.users.getUser(authedUserId);

      try {
        const company = await prisma.company.findUnique({
          where: { id: user.privateMetadata.companyId as string | undefined },
        });
        if (!company)
          throw new TRPCError({
            message: 'Company does not exists',
            code: 'INTERNAL_SERVER_ERROR',
          });

        const project = await prisma.project.create({
          data: {
            name: input.name,
            companyId: company.id,
          },
        });
        await prisma.projectBoard.create({
          data: { name: input.boardName, projectId: project.id },
        });
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          message: 'Something went wrong. Please try again later.',
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    }),
  get: protectedProcedure.query(async ({ ctx: { prisma, authedUserId } }) => {
    const user = await clerkClient.users.getUser(authedUserId);
    try {
      return await prisma.project.findMany({
        where: {
          companyId: user.publicMetadata.companyId || '',
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
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx: { prisma } }) => {
      try {
        return await prisma.project.findUnique({
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
  update: adminProcedure
    .input(projectSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        return await ctx.prisma.project.update({
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
  delete: adminProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
    try {
      return await ctx.prisma.project.delete({
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
});
