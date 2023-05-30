import { Prisma, ProjectBoardColumn, ProjectBoardTask } from '@prisma/client';
import { z } from 'zod';
import { AddColumnSchema } from '@shared/validators/board.schemes';

const projectColumnFull = Prisma.validator<Prisma.ProjectBoardColumnArgs>()({
  include: { projectBoardTasks: true },
});
export type ProjectColumnFull = Prisma.ProjectBoardColumnGetPayload<
  typeof projectColumnFull
>;

export type ProjectBoardColumnType = ProjectBoardColumn & {
  projectBoardTasks: ProjectBoardTaskType[];
};

export type ProjectBoardAssignedUserType = {
  id: string;
  userId: string;
  projectBoardTaskId: string;
};

export type ProjectBoardTaskType = ProjectBoardTask & {
  connectedBranch: string | null;
  users: ProjectBoardAssignedUserType[];
};

export type AddColumnType = z.infer<typeof AddColumnSchema>;
