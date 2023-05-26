import { z } from 'zod';

export const EventSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .min(3, { message: 'Please enter at least 3 characters' })
    .max(20, { message: 'Please enter less that 20 characters' }),
  description: z
    .string()
    .max(1000, { message: 'Please enter less that 1000 characters' }),
  start: z.string(),
  end: z.string(),
  backgroundColor: z.string(),
  users: z.array(z.string()),
  authorId: z.string().optional(),
  taskId: z.string().optional(),
});
