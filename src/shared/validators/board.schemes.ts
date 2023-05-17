import { z } from 'zod';

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  companyId: z.string(),
  startDate: z.date(),
  endDate: z.date().nullable(),
  description: z.string().nullable(),
});

export const projectBoardTaskSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  projectBoardColumnId: z.string(),
  createdAt: z.date(),
  taskPriorityId: z.string().nullable(),
  taskTypeId: z.string().nullable(),
  orderIndex: z.number(),
});

export const projectBoardColumnSchema = z.object({
  id: z.string(),
  name: z.string(),
  projectBoardId: z.string(),
  orderIndex: z.number(),
  projectBoardTasks: z.array(projectBoardTaskSchema),
});

export const projectBoardSchema = z.object({
  id: z.string(),
  name: z.string(),
  projectId: z.string(),
  projectBoardColumns: z.array(projectBoardColumnSchema),
});
