import { z } from 'zod';

export const AddEventSchema = z.object({
  title: z.string(),
  description: z.string(),
  start: z.string(),
  end: z.string(),
  backgroundColor: z.string(),
});
