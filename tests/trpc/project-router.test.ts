import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { appRouter } from '@server/api/router';
import { faker } from '@faker-js/faker';
import { createContextInner } from '@server/api/context';
import { RouterInput } from '@utils/trpc';
import { clerkClient } from '@clerk/nextjs/server';
import { User } from '@clerk/nextjs/dist/api';

describe('project-router test', () => {
  const userId = faker.string.uuid();
  const ctx = createContextInner({ userId });
  const api = appRouter.createCaller(ctx);
  const companyId = faker.string.uuid();

  vi.spyOn(clerkClient.users, 'getUser').mockResolvedValue({
    publicMetadata: { companyId, isAdmin: true },
  } as unknown as User);

  vi.spyOn(clerkClient.users, 'getUserList').mockResolvedValue([
    {
      id: userId,
      username: faker.internet.userName(),
      profileImageUrl: faker.image.url(),
      publicMetadata: { companyId, isAdmin: true },
    },
  ] as unknown as User[]);

  beforeAll(async () => {
    ctx.prisma.company.create({
      data: {
        id: companyId,
        name: faker.company.name(),
      },
    });
  });

  afterAll(async () => {
    await ctx.prisma.company.deleteMany();
    await ctx.prisma.document.deleteMany();
  });

  it("shouldn't create a project because no company", async () => {
    const input: RouterInput['project']['add'] = {
      name: faker.lorem.sentence(1),
      description: faker.lorem.paragraph(1),
      boardName: faker.lorem.sentence(1),
    };

    await expect(api.project.add(input)).rejects.toThrowError();
  });

  it('should get a project', async () => {
    const project = await api.project.get();
    expect(project).toBeDefined();
  });
});
