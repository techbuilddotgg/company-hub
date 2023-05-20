import { z } from 'zod';

export const AddWebhookSchema = z.object({
  repositoryId: z.string().min(3, { message: 'Select one repository' }),
});
