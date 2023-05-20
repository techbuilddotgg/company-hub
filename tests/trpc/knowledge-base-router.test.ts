import { expect, it, describe, vi, beforeAll, afterAll } from 'vitest';
import { faker } from '@faker-js/faker';
import { createContextInner } from '@server/api/context';
import { appRouter } from '@server/api/router';
import { type RouterInput } from '@utils/trpc';
import { clerkClient } from '@clerk/nextjs/server';
import type { User } from '@clerk/nextjs/dist/api';
import * as Pinecone from '@server/libs/pinecone';

describe('knowledge-base-router test', () => {
  const userId = faker.string.uuid();
  const ctx = createContextInner({ userId });
  const api = appRouter.createCaller(ctx);
  const companyId = faker.string.uuid();

  vi.spyOn(clerkClient.users, 'getUser').mockResolvedValue({
    privateMetadata: { companyId },
  } as unknown as User);

  vi.spyOn(clerkClient.users, 'getUserList').mockResolvedValue([
    {
      id: userId,
      username: faker.internet.userName(),
      profileImageUrl: faker.image.url(),
      privateMetadata: { companyId },
    },
  ] as unknown as User[]);

  vi.spyOn(Pinecone, 'uploadDocumentsToPinecone').mockImplementation(
    async () => {},
  );

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

  it('should create a document', async () => {
    const input: RouterInput['knowledgeBase']['saveDocument'] = {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      description: faker.lorem.sentence(),
    };

    const doc = await api.knowledgeBase.saveDocument(input);
    expect(doc).toBeDefined();
  });
  it('should find a document', async () => {
    const title = faker.lorem.sentence();
    const input: RouterInput['knowledgeBase']['findDocuments'] = {
      title: title,
    };

    const document: RouterInput['knowledgeBase']['saveDocument'] = {
      title: title,
      content: faker.lorem.paragraph(),
      description: faker.lorem.sentence(),
    };

    await api.knowledgeBase.saveDocument(document);

    const docs = await api.knowledgeBase.findDocuments(input);
    expect(docs.length).toBe(1);
    expect(docs?.[0]?.title).toBe(title);
  });
  it("shouldn't find a document", async () => {
    const input: RouterInput['knowledgeBase']['findDocuments'] = {
      title: faker.lorem.sentence(),
    };

    const docs = await api.knowledgeBase.findDocuments(input);
    expect(docs.length).toBe(0);
  });
  it('should find a document by id', async () => {
    const document: RouterInput['knowledgeBase']['saveDocument'] = {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      description: faker.lorem.sentence(),
    };

    const { id } = await api.knowledgeBase.saveDocument(document);

    const input: RouterInput['knowledgeBase']['findById'] = {
      id: id,
    };

    const doc = await api.knowledgeBase.findById(input);
    expect(doc).toBeDefined();
  });
  it("shouldn't find a document by id", async () => {
    const input: RouterInput['knowledgeBase']['findById'] = {
      id: faker.string.uuid(),
    };

    const doc = await api.knowledgeBase.findById(input);
    expect(doc).toBeNull();
  });
  it('should update document', async () => {
    const document: RouterInput['knowledgeBase']['saveDocument'] = {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      description: faker.lorem.sentence(),
    };

    const { id } = await api.knowledgeBase.saveDocument(document);

    const input: RouterInput['knowledgeBase']['updateDocument'] = {
      id: id,
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      description: faker.lorem.sentence(),
    };

    const doc = await api.knowledgeBase.updateDocument(input);
    expect(doc).toBeDefined();
    expect(doc?.title).not.toBe(document.title);
    expect(doc?.content).not.toBe(document.content);
    expect(doc?.description).not.toBe(document.description);
  });
  it("shouldn't update document", async () => {
    const input: RouterInput['knowledgeBase']['updateDocument'] = {
      id: faker.string.uuid(),
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      description: faker.lorem.sentence(),
    };

    await expect(
      api.knowledgeBase.updateDocument(input),
    ).rejects.toThrowError();
  });
  it('should delete a document by id', async () => {
    const document: RouterInput['knowledgeBase']['saveDocument'] = {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      description: faker.lorem.sentence(),
    };

    const { id } = await api.knowledgeBase.saveDocument(document);

    const input: RouterInput['knowledgeBase']['deleteDocument'] = {
      id: id,
    };

    const doc = await api.knowledgeBase.deleteDocument(input);
    expect(doc).toBeDefined();
  });
  it("shouldn't delete a document by id", async () => {
    const input: RouterInput['knowledgeBase']['deleteDocument'] = {
      id: faker.string.uuid(),
    };

    await expect(
      api.knowledgeBase.deleteDocument(input),
    ).rejects.toThrowError();
  });
});
