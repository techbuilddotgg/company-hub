import { z } from 'zod';

export const AddColumnSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Enter at least 3 chars' })
    .max(20, { message: 'Enter max 20 chars' }),
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  abbreviation: z.string(),
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

export const projectBoardTaskSchemaOptional = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  projectBoardColumnId: z.string().optional(),
  createdAt: z.date().optional(),
  deadLine: z.union([z.date(), z.null()]).optional(),
  taskPriorityId: z.string().nullable().optional(),
  taskTypeId: z.string().nullable().optional(),
  orderIndex: z.number().optional(),
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
