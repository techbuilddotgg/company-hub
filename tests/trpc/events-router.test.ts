import { describe, expect, it } from 'vitest';
import { faker } from '@faker-js/faker';
import { createContextInner } from '@server/api/context';
import { appRouter } from '@server/api/router';
import { type RouterInput } from '@utils/trpc';

describe('events-router test', () => {
  const userId = faker.string.uuid();
  const ctx = createContextInner({ userId });
  const api = appRouter.createCaller(ctx);

  it('should get events', async () => {
    const events = await api.event.get();
    expect(events).toHaveLength(0);
  });
  it('should delete event', async () => {
    const title = faker.lorem.word(10);
    const description = faker.lorem.sentence();
    const start = faker.date.soon().toISOString();
    const end = faker.date.soon({ days: 1, refDate: start }).toISOString();
    const backgroundColor = faker.internet.color();
    const authorId = userId;
    const users = [userId];

    const event: RouterInput['event']['add'] = {
      title,
      description,
      start,
      end,
      backgroundColor,
      authorId,
      users,
    };

    await api.event.add(event);
    const events = await api.event.get();
    const id: RouterInput['event']['delete'] = events[0]?.id as string;

    await api.event.delete(id);

    expect(await api.event.get()).toHaveLength(0);
  });
  it('should create new event', async () => {
    const title = faker.lorem.word(10);
    const description = faker.lorem.sentence();
    const start = faker.date.soon().toISOString();
    const end = faker.date.soon({ days: 1, refDate: start }).toISOString();
    const backgroundColor = faker.internet.color();
    const authorId = userId;
    const users = [userId];

    const input: RouterInput['event']['add'] = {
      title,
      description,
      start,
      end,
      backgroundColor,
      authorId,
      users,
    };

    await api.event.add(input);

    const events = await api.event.get();
    expect(events).toHaveLength(1);

    await api.event.delete(events[0]?.id as string);
  });

  it('should update event', async () => {
    const title = faker.lorem.word(10);
    const description = faker.lorem.sentence(2);
    const start = faker.date.soon().toISOString();
    const end = faker.date.soon({ days: 1, refDate: start }).toISOString();
    const backgroundColor = faker.internet.color();
    const authorId = userId;
    const users = [userId];

    const inputAdd: RouterInput['event']['add'] = {
      title,
      description,
      start,
      end,
      backgroundColor,
      authorId,
      users,
    };

    await api.event.add(inputAdd);
    const events = await api.event.get();
    const id: RouterInput['event']['delete'] = events[0]?.id as string;

    const input: RouterInput['event']['update'] = {
      id,
      title,
      description,
      start,
      end,
      backgroundColor,
      users,
    };

    const event = await api.event.update(input);
    expect(event).toBeDefined();

    await api.event.delete(id);
  });
  it("shouldn't delete event", async () => {
    const id: string = faker.string.uuid();

    await expect(api.event.delete(id)).rejects.toThrowError();
  });
  it('should get event users', async () => {
    const title = faker.lorem.word(10);
    const description = faker.lorem.sentence();
    const start = faker.date.soon().toISOString();
    const end = faker.date.soon({ days: 1, refDate: start }).toISOString();
    const backgroundColor = faker.internet.color();
    const authorId = userId;
    const invitedUserId = faker.string.uuid();
    const users = [userId, invitedUserId];

    const event: RouterInput['event']['add'] = {
      title,
      description,
      start,
      end,
      backgroundColor,
      authorId,
      users,
    };

    await api.event.add(event);
    const events = await api.event.get();
    const id: RouterInput['event']['getEventUsers'] = events[0]?.id as string;

    const res = await api.event.getEventUsers(id);

    expect(res?.users[0]?.userId).toBe(userId);
    expect(res?.users[1]?.userId).toBe(invitedUserId);
    expect(res?.users).toHaveLength(2);

    await api.event.delete(id);
  });
  it("shouldn't get event users", async () => {
    const id: RouterInput['event']['getEventUsers'] = faker.string.uuid();

    expect(await api.event.getEventUsers(id)).toBe(null);
  });
});
