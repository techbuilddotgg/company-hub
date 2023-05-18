import { protectedProcedure, t } from '../trpc';
import { z } from 'zod';
import { clerkClient } from '@clerk/nextjs/server';
import { filterUserForClient } from '@server/helpers/filterUserForClient';

export const knowledgeBaseRouter = t.router({
  saveDocument: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ input, ctx: { prisma, authedUserId: userId } }) => {
      const user = await clerkClient.users.getUser(userId);
      return await prisma.document.create({
        data: {
          ...input,
          authorId: userId,
          companyId: user.privateMetadata.companyId as string,
        },
      });
    }),

  findDocuments: protectedProcedure
    .input(
      z
        .object({
          title: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ input, ctx }) => {
      const user = await clerkClient.users.getUser(ctx.authedUserId);
      const docs = await ctx.prisma.document.findMany({
        where: {
          title: {
            contains: input?.title,
          },
          companyId: user.privateMetadata.companyId as string,
        },
      });

      const userIds = docs.map((doc) => doc.authorId);

      const users = (
        await clerkClient.users.getUserList({ userId: userIds, limit: 100 })
      ).map(filterUserForClient);

      return docs.map((doc) => {
        const author = users.find((user) => user.id === doc.authorId);
        if (!author) throw new Error('Author not found');

        return {
          ...doc,
          author,
        };
      });
    }),

  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.document.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
});
