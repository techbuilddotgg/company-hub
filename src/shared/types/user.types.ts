import { UserInviteSchema } from '../validators/user.schemes';
import { z } from 'zod';

export type UserInviteType = z.infer<typeof UserInviteSchema>;
export enum UserRole {
  ADMIN = 'ADMIN',
  BASIC = 'BASIC',
}
import { UserResource } from '@clerk/types';

export type authUser = UserResource | null | undefined;
