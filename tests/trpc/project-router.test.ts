import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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

  beforeEach(async () => {
    await ctx.prisma.company.create({
      data: {
        id: companyId,
        name: faker.company.name(),
      },
    });
  });

  afterEach(async () => {
    await ctx.prisma.company.deleteMany();
    await ctx.prisma.project.deleteMany();
  });

  it('should create a project', async () => {
    const input: RouterInput['project']['add'] = {
      name: faker.lorem.word(5),
      description: faker.lorem.paragraph(1),
      boardName: faker.lorem.sentence(1),
      abbreviation: faker.lorem.word(3),
    };

    const project = await api.project.add(input);
    expect(project).toBeDefined();
  });

  it('should get a project', async () => {
    const input: RouterInput['project']['add'] = {
      name: faker.lorem.word(5),
      description: faker.lorem.paragraph(1),
      boardName: faker.lorem.sentence(1),
      abbreviation: faker.lorem.word(3),
    };

    await api.project.add(input);
    const projects = await api.project.get();
    expect(projects).toBeDefined();
  });

  it('should update project', async () => {
    const input: RouterInput['project']['add'] = {
      name: faker.lorem.word(5),
      description: faker.lorem.paragraph(1),
      boardName: faker.lorem.sentence(1),
      abbreviation: faker.lorem.word(3),
    };

    const { data: project } = await api.project.add(input);

    const updateInput: RouterInput['project']['update'] = {
      id: project.id,
      name: faker.lorem.word(5),
      companyId: companyId,
      startDate: faker.date.recent(),
      endDate: null,
      description: null,
      abbreviation: 'PRO',
    };

    const { data: updatedProject } = await api.project.update(updateInput);
    expect(updatedProject).toBeDefined();
    expect(updatedProject?.name).not.toBe(input.name);
  });

  it('should delete project', async () => {
    const input: RouterInput['project']['add'] = {
      name: faker.lorem.word(5),
      description: faker.lorem.paragraph(1),
      boardName: faker.lorem.word(5),
      abbreviation: faker.lorem.word(3),
    };

    const { data: project } = await api.project.add(input);

    await api.project.delete(project.id);
    const projectThatShouldBeDeleted = await ctx.prisma.project.findUnique({
      where: { id: project.id },
    });

    expect(projectThatShouldBeDeleted).toBeNull();
  });
});
