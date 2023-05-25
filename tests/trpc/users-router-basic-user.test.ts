import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { faker } from '@faker-js/faker';
import { createContextInner } from '@server/api/context';
import { appRouter } from '@server/api/router';
import { type RouterInput } from '@utils/trpc';
import { clerkClient } from '@clerk/nextjs/server';
import type { User } from '@clerk/nextjs/dist/api';

describe('users-router-basic-user test', () => {
  const userId = faker.string.uuid();
  const ctx = createContextInner({ userId });
  const api = appRouter.createCaller(ctx);
  const companyId = faker.string.uuid();

  vi.spyOn(clerkClient.users, 'getUser').mockResolvedValue({
    publicMetadata: { companyId },
  } as unknown as User);

  beforeAll(async () => {
    await ctx.prisma.company.create({
      data: {
        id: companyId,
        name: faker.company.name(),
      },
    });
  });

  afterAll(async () => {
    await ctx.prisma.company.deleteMany();
  });

  it("should'n invite user", async () => {
    const input: RouterInput['users']['invite'] = {
      email: faker.internet.email(),
      isAdmin: false,
    };
    expect(api.users.invite(input)).rejects.toThrowError();
  });
  it("should'n delete", async () => {
    const input: RouterInput['users']['delete'] = {
      id: faker.string.uuid(),
    };
    expect(api.users.delete(input)).rejects.toThrowError();
  });
  it("should'n delete", async () => {
    const input: RouterInput['users']['revokeInvitation'] = {
      id: faker.string.uuid(),
    };
    expect(api.users.revokeInvitation(input)).rejects.toThrowError();
  });
});
