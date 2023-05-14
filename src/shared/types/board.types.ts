import { Prisma } from '@prisma/client';

const projectColumnFull = Prisma.validator<Prisma.ProjectBoardColumnArgs>()({
  include: { projectBoardTasks: true },
});
export type ProjectColumnFull = Prisma.ProjectBoardColumnGetPayload<
  typeof projectColumnFull
>;
