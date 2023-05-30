import { adminProcedure, protectedProcedure, t } from '../trpc';
import { z } from 'zod';
import { clerkClient } from '@clerk/nextjs/server';
import { TRPCError } from '@trpc/server';
import { getBaseUrl } from '@utils/trpc';
import { Invitation, UserRole } from '@shared/types/user.types';
import { env } from '@env';
import { errorHandler } from '@utils/error-handler';

export const usersRouter = t.router({
  invite: adminProcedure
    .input(z.object({ email: z.string(), isAdmin: z.boolean() }))
    .mutation(
      errorHandler(async ({ input, ctx }) => {
        const invitation = await clerkClient.invitations.createInvitation({
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
          message: {
            title: 'Invitation send',
            description: `Invitation sent to ${allowListResponse.identifier}`,
          },
          data: invitation,
        };
      }),
    ),
  findAll: protectedProcedure.query(
    errorHandler(async () => {
      return await clerkClient.users.getUserList({ limit: 100 });
    }),
  ),
  getInvitations: protectedProcedure.query(
    errorHandler(async () => {
      const invitationsResponse = await fetch(
        `https://api.clerk.dev/v1/invitations`,
        {
          headers: {
            Authorization: `Bearer ${env.CLERK_SECRET_KEY}`,
          },
        },
      );
      const invitations: Invitation[] = await invitationsResponse.json();
      return invitations.filter(
        (invitation) => invitation.status === 'pending',
      );
    }),
  ),
  updateRole: adminProcedure
    .input(
      z.object({
        id: z.string(),
        role: z.enum([UserRole.ADMIN, UserRole.BASIC]),
      }),
    )
    .mutation(
      errorHandler(async ({ input }) => {
        const currentUser = await clerkClient.users.getUser(input.id);
        const user = await clerkClient.users.updateUser(input.id, {
          publicMetadata: {
            ...currentUser.publicMetadata,
            isAdmin: input.role === UserRole.ADMIN,
          },
        });

        if (!user || !user.primaryEmailAddressId) {
          throw new TRPCError({
            message: 'User not found',
            code: 'NOT_FOUND',
          });
        }
        const emailResponse = await clerkClient.emailAddresses.getEmailAddress(
          user.primaryEmailAddressId,
        );

        return {
          message: {
            title: 'User updated',
            description: `Update role for user ${emailResponse.emailAddress} to ${input.role}`,
          },
          data: user,
        };
      }),
    ),
  delete: adminProcedure.input(z.object({ id: z.string() })).mutation(
    errorHandler(async ({ input }) => {
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
      const deletedUser = await clerkClient.users.deleteUser(userToDelete.id);
      await clerkClient.allowlistIdentifiers.deleteAllowlistIdentifier(
        identifier.id,
      );

      return {
        message: {
          title: 'User deleted',
          description: `User with email ${emailResponse.emailAddress} successfully deleted`,
        },
        data: deletedUser,
      };
    }),
  ),

  revokeInvitation: adminProcedure.input(z.object({ id: z.string() })).mutation(
    errorHandler(async ({ input }) => {
      const revokedInvitation = await clerkClient.invitations.revokeInvitation(
        input.id,
      );
      if (!revokedInvitation) {
        throw new TRPCError({
          message: 'Invitation not found',
          code: 'NOT_FOUND',
        });
      }
      const identifiers =
        await clerkClient.allowlistIdentifiers.getAllowlistIdentifierList();
      const identifier = identifiers.find(
        (identifier) =>
          identifier.identifier === revokedInvitation.emailAddress,
      );
      if (!identifier) {
        throw new TRPCError({
          message: 'Identifier not found',
          code: 'NOT_FOUND',
        });
      }
      await clerkClient.allowlistIdentifiers.deleteAllowlistIdentifier(
        identifier.id,
      );
      return {
        message: {
          title: 'Revoke invitation',
          description: `Invitation for user with email ${revokedInvitation.emailAddress} revoked successfully`,
        },
        data: revokedInvitation,
      };
    }),
  ),
});
