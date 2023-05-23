import { adminProcedure, protectedProcedure, t } from '../trpc';
import { z } from 'zod';
import { clerkClient } from '@clerk/nextjs/server';
import { TRPCError } from '@trpc/server';
import { getBaseUrl } from '@utils/trpc';

export const usersRouter = t.router({
  invite: adminProcedure
    .input(z.object({ email: z.string(), isAdmin: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      console.log(ctx.companyId);
      try {
        await clerkClient.invitations.createInvitation({
          emailAddress: input.email,
          redirectUrl: getBaseUrl() + '/signup',
          publicMetadata: {
            isAdmin: input.isAdmin,
            companyId: ctx.companyId,
          },
        });
        const allowListResponse =
          await clerkClient.allowlistIdentifiers.createAllowlistIdentifier({
            identifier: input.email,
            notify: true,
          });

        return {
          message: 'Invitation sent to ' + allowListResponse.identifier,
        };
      } catch (error) {
        throw new TRPCError({
          message: 'Something went wrong. Please try again later.',
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    }),
  findAll: protectedProcedure.query(async () => {
    return await clerkClient.users.getUserList({ limit: 100 });
  }),
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const userToDelete = await clerkClient.users.getUser(input.id);
        if (!userToDelete || !userToDelete.primaryEmailAddressId) {
          throw new TRPCError({
            message: 'User not found',
            code: 'NOT_FOUND',
          });
        }
        const emailResponse = await clerkClient.emailAddresses.getEmailAddress(
          userToDelete.primaryEmailAddressId,
        );
        const identifiers =
          await clerkClient.allowlistIdentifiers.getAllowlistIdentifierList();
        const identifier = identifiers.find(
          (identifier) => identifier.identifier === emailResponse.emailAddress,
        );

        if (!identifier) {
          throw new TRPCError({
            message: 'Identifier not found',
            code: 'NOT_FOUND',
          });
        }
        await clerkClient.users.deleteUser(userToDelete.id);
        await clerkClient.allowlistIdentifiers.deleteAllowlistIdentifier(
          identifier.id,
        );

        return { message: 'User deleted' };
      } catch (e) {
        const message =
          e instanceof TRPCError
            ? e.message
            : 'Something went wrong. Please try again later.';
        const code = e instanceof TRPCError ? e.code : 'INTERNAL_SERVER_ERROR';
        throw new TRPCError({ message, code });
      }
    }),
});
