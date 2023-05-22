import { UserInviteSchema } from '../validators/user.schemes';
import { z } from 'zod';

export type UserInviteType = z.infer<typeof UserInviteSchema>;
export enum UserRole {
  ADMIN = 'ADMIN',
  BASIC = 'BASIC',
}
