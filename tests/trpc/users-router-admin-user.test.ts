import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { faker } from '@faker-js/faker';
import { createContextInner } from '@server/api/context';
import { appRouter } from '@server/api/router';
import { type RouterInput } from '@utils/trpc';
import { clerkClient } from '@clerk/nextjs/server';
import type { User } from '@clerk/nextjs/dist/api';

describe('users-router-admin-user test', () => {
  const userId = faker.string.uuid();
  const ctx = createContextInner({ userId });
  const api = appRouter.createCaller(ctx);
  const companyId = faker.string.uuid();

  vi.spyOn(clerkClient.users, 'getUser').mockResolvedValue({
    publicMetadata: { companyId, isAdmin: true },
  } as unknown as User);

  beforeAll(async () => {
    await ctx.prisma.company.create({
      data: {
        id: companyId,
        name: faker.company.name(),
      },
    });
    // await clerkClient.users.createUser({
    //   emailAddress: [faker.internet.email()],
    //   password: faker.internet.password(),
    //   publicMetadata: { companyId },
    // });
  });

  afterAll(async () => {
    await ctx.prisma.company.deleteMany();
  });

  it('should invite user', async () => {
    const input: RouterInput['users']['invite'] = {
      email: faker.internet.email(),
      isAdmin: false,
    };
    await api.users.invite(input);

    const invitations = await api.users.getInvitations();
    const invitation = invitations.find(
      (i) => i.emailAddress.toLowerCase() === input.email.toLowerCase(),
    );
    const allowList =
      await clerkClient.allowlistIdentifiers.getAllowlistIdentifierList();

    const allowListItem = allowList.find(
      (item) => item.invitationId === invitation?.id,
    );
    expect(invitation).toBeDefined();
    expect(allowListItem).toBeDefined();

    await clerkClient.invitations.revokeInvitation(invitation?.id as string);
    await clerkClient.allowlistIdentifiers.deleteAllowlistIdentifier(
      allowListItem?.id as string,
    );
  });
  it('should revoke invitation', async () => {
    const input: RouterInput['users']['invite'] = {
      email: faker.internet.email(),
      isAdmin: false,
    };
    const response = await api.users.invite(input);

    await api.users.revokeInvitation({ id: response.data.id });
    const invitations = await clerkClient.invitations.getInvitationList();
    const invitation = invitations.find((i) => i.id === response.data.id);
    expect(invitation).toBeUndefined();
  });
});
