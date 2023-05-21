import { protectedProcedure, t } from '../trpc';
import { z } from 'zod';
import { clerkClient } from '@clerk/nextjs/server';
import { filterUserForClient } from '@server/helpers/filterUserForClient';
import {
  CreateDocumentValidator,
  UpdateDocumentValidator,
} from '@shared/validators/knowledge-base-validators';
import { prepareDocument, textToDocument } from '@server/libs/langchain';
import {
  deleteDocumentFromPinecone,
  uploadDocumentsToPinecone,
} from '@server/libs/pinecone';
import { TRPCError } from '@trpc/server';

export const knowledgeBaseRouter = t.router({
  saveDocument: protectedProcedure
    .input(CreateDocumentValidator)
    .mutation(async ({ input, ctx: { prisma, authedUserId: userId } }) => {
      const user = await clerkClient.users.getUser(userId);

      const result = await prisma.document.create({
        data: {
          ...input,
          authorId: userId,
          companyId: user.privateMetadata.companyId as string,
        },
      });

      const doc = textToDocument(input.content);

      const metadata = {
        authorId: userId,
        companyId: user.privateMetadata.companyId as string,
        documentId: result.id,
      };

      const docs = await prepareDocument([doc], metadata);
      await uploadDocumentsToPinecone(docs);

      return result;
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
      const doc = await ctx.prisma.document.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!doc)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Document not found',
        });
      const user = await clerkClient.users.getUser(doc?.authorId);
      return { ...doc, author: filterUserForClient(user) };
    }),

  deleteDocument: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await deleteDocumentFromPinecone({
        documentId: input.id,
      });

      return await ctx.prisma.document.delete({
        where: {
          id: input.id,
        },
      });
    }),

  updateDocument: protectedProcedure
    .input(UpdateDocumentValidator)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.document.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          content: input.content,
          description: input.description,
        },
      });
    }),
});
