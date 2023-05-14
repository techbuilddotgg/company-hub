import { protectedProcedure, t } from '../trpc';
import { z } from 'zod';
import { clerkClient } from '@clerk/nextjs/server';
import { TRPCError } from '@trpc/server';
import { getBaseUrl } from '@utils/trpc';

export const usersRouter = t.router({
  invite: protectedProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await clerkClient.invitations.createInvitation({
          emailAddress: input.email,
          redirectUrl: getBaseUrl() + '/signup',
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
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await clerkClient.users.deleteUser(input.id);
        return { message: 'User deleted' };
      } catch (e) {
        throw new TRPCError({
          message: 'Something went wrong. Please try again later.',
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    }),
});
