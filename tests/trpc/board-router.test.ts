import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { appRouter } from '@server/api/router';
import { faker } from '@faker-js/faker';
import { createContextInner } from '@server/api/context';
import { RouterInput } from '@utils/trpc';
import { clerkClient } from '@clerk/nextjs/server';
import { User } from '@clerk/nextjs/dist/api';

describe('board-router test', () => {
  const userId = faker.string.uuid();
  const ctx = createContextInner({ userId });
  const api = appRouter.createCaller(ctx);
  const companyId = faker.string.uuid();

  vi.mock('pusher', () => {
    const Pusher = vi.fn();
    Pusher.prototype.trigger = () => {
      return true;
    };

    return { default: Pusher };
  });

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
    await ctx.prisma.company.create({
      data: {
        id: companyId,
        name: faker.company.name(),
      },
    });
  });

  afterAll(async () => {
    await ctx.prisma.company.deleteMany();
    await ctx.prisma.projectBoardTaskComment.deleteMany();
    await ctx.prisma.projectBoardColumn.deleteMany();
    await ctx.prisma.projectBoard.deleteMany();
    await ctx.prisma.projectBoardTask.deleteMany();
    await ctx.prisma.projectBoardTaskUser.deleteMany();
  });

  it('should create a board', async () => {
    const input: RouterInput['board']['addBoard'] = {
      name: faker.lorem.sentence(),
      projectId: faker.string.uuid(),
    };

    const board = await api.board.addBoard(input);
    expect(board).toBeDefined();
  });

  it('should create a column', async () => {
    const boardInput: RouterInput['board']['addBoard'] = {
      name: faker.lorem.sentence(),
      projectId: faker.string.uuid(),
    };

    const { data: board } = await api.board.addBoard(boardInput);

    const input: RouterInput['board']['addColumn'] = {
      name: faker.lorem.sentence(),
      boardId: board.id,
    };

    const column = await api.board.addColumn(input);
    expect(column).toBeDefined();
  });

  it('should create a task', async () => {
    const boardInput: RouterInput['board']['addBoard'] = {
      name: faker.lorem.sentence(),
      projectId: faker.string.uuid(),
    };

    const { data: board } = await api.board.addBoard(boardInput);

    const columnInput: RouterInput['board']['addColumn'] = {
      name: faker.lorem.sentence(),
      boardId: board.id,
    };

    const { data: column } = await api.board.addColumn(columnInput);

    const input: RouterInput['board']['addTask'] = {
      name: faker.lorem.sentence(),
      columnId: column.id,
    };

    const task = await api.board.addTask(input);
    expect(task).toBeDefined();
  });

  it('should find a task', async () => {
    const boardInput: RouterInput['board']['addBoard'] = {
      name: faker.lorem.sentence(),
      projectId: faker.string.uuid(),
    };

    const { data: board } = await api.board.addBoard(boardInput);

    const columnInput: RouterInput['board']['addColumn'] = {
      name: faker.lorem.sentence(),
      boardId: board.id,
    };

    const { data: column } = await api.board.addColumn(columnInput);

    const name = faker.lorem.sentence();
    const task: RouterInput['board']['addTask'] = {
      name: name,
      columnId: column.id,
    };

    const { data } = await api.board.addTask(task);

    const input: RouterInput['board']['getTask'] = {
      taskId: data.id,
    };

    const returnedTask = await api.board.getTask(input);
    expect(returnedTask).toBeDefined();
  });

  it('should update board', async () => {
    const boardInput: RouterInput['board']['addBoard'] = {
      name: faker.lorem.sentence(),
      projectId: faker.string.uuid(),
    };

    const { data: board } = await api.board.addBoard(boardInput);

    const input: RouterInput['board']['updateBoard'] = {
      id: board.id,
      name: faker.lorem.sentence(),
      projectId: boardInput.projectId,
    };

    const { data: updatedBoard } = await api.board.updateBoard(input);
    expect(updatedBoard).toBeDefined();
    expect(updatedBoard?.name).not.toBe(boardInput.name);
  });

  it("shouldn't update board", async () => {
    const input: RouterInput['board']['updateBoard'] = {
      id: faker.string.uuid(),
      name: faker.lorem.sentence(),
      projectId: faker.string.uuid(),
    };
    await expect(api.board.updateBoard(input)).rejects.toThrowError();
  });

  it('should update column', async () => {
    const boardInput: RouterInput['board']['addBoard'] = {
      name: faker.lorem.sentence(),
      projectId: faker.string.uuid(),
    };

    const { data: board } = await api.board.addBoard(boardInput);

    const columnInput: RouterInput['board']['addColumn'] = {
      name: faker.lorem.sentence(),
      boardId: board.id,
    };

    const { data: column } = await api.board.addColumn(columnInput);

    const input: RouterInput['board']['updateColumn'] = {
      id: column.id,
      name: faker.lorem.sentence(),
    };

    const { data: updatedColumn } = await api.board.updateColumn(input);
    expect(updatedColumn).toBeDefined();
    expect(updatedColumn?.name).not.toBe(columnInput.name);
  });

  it("shouldn't update column", async () => {
    const input: RouterInput['board']['updateColumn'] = {
      id: faker.string.uuid(),
      name: faker.lorem.sentence(),
    };
    await expect(api.board.updateColumn(input)).rejects.toThrowError();
  });

  it('should update task', async () => {
    const boardInput: RouterInput['board']['addBoard'] = {
      name: faker.lorem.sentence(),
      projectId: faker.string.uuid(),
    };

    const { data: board } = await api.board.addBoard(boardInput);

    const columnInput: RouterInput['board']['addColumn'] = {
      name: faker.lorem.sentence(),
      boardId: board.id,
    };

    const { data: column } = await api.board.addColumn(columnInput);

    const taskInput: RouterInput['board']['addTask'] = {
      name: faker.lorem.sentence(),
      columnId: column.id,
    };

    const { data: task } = await api.board.addTask(taskInput);

    const inputUpdateTask: RouterInput['board']['updateTask'] = {
      id: task.id,
      name: faker.lorem.sentence(),
    };

    const { data: updatedTask } = await api.board.updateTask(inputUpdateTask);
    expect(updatedTask).toBeDefined();
    expect(updatedTask?.name).not.toBe(taskInput.name);
  });

  it("shouldn't update task", async () => {
    const inputUpdateTask: RouterInput['board']['updateTask'] = {
      id: faker.string.uuid(),
      name: faker.lorem.sentence(),
    };

    await expect(api.board.updateTask(inputUpdateTask)).rejects.toThrowError();
  });

  it('should assign user to task', async () => {
    const boardInput: RouterInput['board']['addBoard'] = {
      name: faker.lorem.sentence(),
      projectId: faker.string.uuid(),
    };

    const { data: board } = await api.board.addBoard(boardInput);

    const columnInput: RouterInput['board']['addColumn'] = {
      name: faker.lorem.sentence(),
      boardId: board.id,
    };

    const { data: column } = await api.board.addColumn(columnInput);

    const input: RouterInput['board']['addTask'] = {
      name: faker.lorem.sentence(),
      columnId: column.id,
    };

    const { data: task } = await api.board.addTask(input);

    const addUserInput: RouterInput['board']['addUserToTask'] = {
      taskId: task.id,
      userId: faker.string.uuid(),
    };

    const { data: taskUser } = await api.board.addUserToTask(addUserInput);
    expect(taskUser).toBeDefined();
  });

  it('should get users assigned to task', async () => {
    const boardInput: RouterInput['board']['addBoard'] = {
      name: faker.lorem.sentence(),
      projectId: faker.string.uuid(),
    };

    const { data: board } = await api.board.addBoard(boardInput);

    const columnInput: RouterInput['board']['addColumn'] = {
      name: faker.lorem.sentence(),
      boardId: board.id,
    };

    const { data: column } = await api.board.addColumn(columnInput);

    const input: RouterInput['board']['addTask'] = {
      name: faker.lorem.sentence(),
      columnId: column.id,
    };

    const { data: task } = await api.board.addTask(input);

    const addUserInput: RouterInput['board']['addUserToTask'] = {
      taskId: task.id,
      userId: faker.string.uuid(),
    };

    await api.board.addUserToTask(addUserInput);

    const getUsersInput: RouterInput['board']['getUsersAssignedToTask'] = {
      taskId: task.id,
    };

    const usersIds = await api.board.getUsersAssignedToTask(getUsersInput);
    expect(usersIds.length > 0).toBeTruthy();
  });

  it('should remove user from task', async () => {
    const boardInput: RouterInput['board']['addBoard'] = {
      name: faker.lorem.sentence(),
      projectId: faker.string.uuid(),
    };

    const { data: board } = await api.board.addBoard(boardInput);

    const columnInput: RouterInput['board']['addColumn'] = {
      name: faker.lorem.sentence(),
      boardId: board.id,
    };

    const { data: column } = await api.board.addColumn(columnInput);

    const input: RouterInput['board']['addTask'] = {
      name: faker.lorem.sentence(),
      columnId: column.id,
    };

    const { data: task } = await api.board.addTask(input);

    const addUserInput: RouterInput['board']['addUserToTask'] = {
      taskId: task.id,
      userId: faker.string.uuid(),
    };

    const { data: userTask } = await api.board.addUserToTask(addUserInput);
    const userFromTaskInput: RouterInput['board']['removeUserFromTask'] = {
      userId: addUserInput.userId,
      taskId: userTask.id,
    };

    const removedUserTask = await api.board.removeUserFromTask(
      userFromTaskInput,
    );
    expect(removedUserTask).toBeDefined();
  });

  it('should comment task', async () => {
    const boardInput: RouterInput['board']['addBoard'] = {
      name: faker.lorem.sentence(),
      projectId: faker.string.uuid(),
    };

    const { data: board } = await api.board.addBoard(boardInput);

    const columnInput: RouterInput['board']['addColumn'] = {
      name: faker.lorem.sentence(),
      boardId: board.id,
    };

    const { data: column } = await api.board.addColumn(columnInput);

    const input: RouterInput['board']['addTask'] = {
      name: faker.lorem.sentence(),
      columnId: column.id,
    };

    const { data: task } = await api.board.addTask(input);

    const commentTicketInput: RouterInput['board']['commentTicket'] = {
      taskId: task.id,
      userId: faker.string.uuid(),
      comment: faker.lorem.sentence(),
      email: faker.internet.email(),
    };

    const taskComment = await api.board.commentTicket(commentTicketInput);
    expect(taskComment).toBeDefined();
  });

  it('should get comments from task', async () => {
    const boardInput: RouterInput['board']['addBoard'] = {
      name: faker.lorem.sentence(),
      projectId: faker.string.uuid(),
    };

    const { data: board } = await api.board.addBoard(boardInput);

    const columnInput: RouterInput['board']['addColumn'] = {
      name: faker.lorem.sentence(),
      boardId: board.id,
    };

    const { data: column } = await api.board.addColumn(columnInput);

    const input: RouterInput['board']['addTask'] = {
      name: faker.lorem.sentence(),
      columnId: column.id,
    };

    const { data: task } = await api.board.addTask(input);

    const commentTicketInput: RouterInput['board']['commentTicket'] = {
      taskId: task.id,
      userId: faker.string.uuid(),
      comment: faker.lorem.sentence(),
      email: faker.internet.email(),
    };

    await api.board.commentTicket(commentTicketInput);

    const getTaskCommentsInput: RouterInput['board']['getTaskComments'] = {
      taskId: task.id,
    };

    const comments = await api.board.getTaskComments(getTaskCommentsInput);
    expect(comments).toBeDefined();
  });

  it('should get task types', async () => {
    const taskTypes = await api.board.getTaskTypes();
    expect(taskTypes).toBeDefined();
  });

  it('should get task priorities', async () => {
    const taskPriorities = await api.board.getTaskPriorities();
    expect(taskPriorities).toBeDefined();
  });
});
