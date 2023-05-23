import { z } from 'zod';

export const AddProjectSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Please enter at least 3 characters' })
    .max(20, { message: 'Please enter less that 20 characters' }),
  boardName: z
    .string()
    .min(3, { message: 'Please enter at least 3 characters' })
    .max(20, { message: 'Please enter less that 20 characters' }),
  description: z
    .string()
    .max(1000, { message: 'Please enter less that 1000 characters' }),
});
