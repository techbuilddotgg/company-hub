import { z } from 'zod';

export const UserInviteSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  isAdmin: z.boolean(),
});
