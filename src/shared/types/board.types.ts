import { Prisma, ProjectBoardColumn, ProjectBoardTask } from '@prisma/client';

const projectColumnFull = Prisma.validator<Prisma.ProjectBoardColumnArgs>()({
  include: { projectBoardTasks: true },
});
export type ProjectColumnFull = Prisma.ProjectBoardColumnGetPayload<
  typeof projectColumnFull
>;

export type ProjectBoardColumnType = ProjectBoardColumn & {
  projectBoardTasks: ProjectBoardTaskType[];
};

export type ProjectBoardTaskType = ProjectBoardTask & {
  connectedBranch: string | null;
};
