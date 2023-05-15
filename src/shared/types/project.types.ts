import { z } from 'zod';
import { AddProjectSchema } from '../validators/project.schemes';
import { Prisma } from '@prisma/client';

export type AddProjectType = z.infer<typeof AddProjectSchema>;

const projectWithBoards = Prisma.validator<Prisma.ProjectArgs>()({
  include: { projectBoards: true },
});
export type ProjectWithBoards = Prisma.ProjectGetPayload<
  typeof projectWithBoards
>;
