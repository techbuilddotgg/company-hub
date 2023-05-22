import { z } from 'zod';

export const CreateDocumentValidator = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(3, 'Content must be at least 3 characters'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
});

export const UpdateDocumentValidator = z.object({
  id: z.string(),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(3, 'Content must be at least 3 characters'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
});
