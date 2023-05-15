import { z } from 'zod';
import { AddProjectSchema } from '../validators/project.schemes';

export type AddProjectType = z.infer<typeof AddProjectSchema>;
