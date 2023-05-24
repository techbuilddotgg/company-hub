import {
  UserInviteSchema,
  UserRoleUpdateSchema,
} from '../validators/user.schemes';
import { z } from 'zod';
import { UserResource } from '@clerk/types';

export type UserInviteType = z.infer<typeof UserInviteSchema>;
export enum UserRole {
  ADMIN = 'ADMIN',
  BASIC = 'BASIC',
}

export type authUser = UserResource | null | undefined;

export type User = {
  id: string;
  emailAddress: string;
  pending: boolean;
  role: UserRole | null;
};

export type UserRoleUpdateType = z.infer<typeof UserRoleUpdateSchema>;
