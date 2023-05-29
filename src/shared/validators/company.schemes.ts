import { z } from 'zod';

export const SaveCompanySchema = z.object({
  logo: z.any(),
  name: z
    .string()
    .min(3, { message: 'Please enter at least 3 characters' })
    .max(10, { message: 'Please enter less that 10 characters' }),
});
