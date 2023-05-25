import { z } from 'zod';
import { UserRole } from '@shared/types/user.types';

export const UserInviteSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  isAdmin: z.boolean(),
});

export const UserRoleUpdateSchema = z.object({
  role: z.enum([UserRole.ADMIN, UserRole.BASIC]).nullable(),
});
