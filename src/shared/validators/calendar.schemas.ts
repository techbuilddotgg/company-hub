import { z } from 'zod';

export const EventSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  start: z.string(),
  end: z.string(),
  backgroundColor: z.string(),
  users: z.array(z.string()),
  authorId: z.string().optional(),
});
