import { z } from 'zod';

export const AddProjectSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Enter at least 3 chars' })
    .max(20, { message: 'Max is 20' }),
  boardName: z
    .string()
    .min(3, { message: 'Enter at least 3 chars' })
    .max(20, { message: 'Max is 20' }),
  description: z.string().max(1000, { message: 'Max is 100' }),
});
