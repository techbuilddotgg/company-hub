import React from 'react';
import { XIcon } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import {
  AlertDialogButton,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components';
import { User, UserRole, UserRoleUpdateType } from '@shared/types/user.types';
import { useQueryClient } from '@tanstack/react-query';
import { trpc } from '@utils/trpc';
import { getQueryKey } from '@trpc/react-query';

interface UserProps {
  user: User;
}

const Employee = ({ user }: UserProps) => {
  const { user: clerkUser } = useUser();
  const queryClient = useQueryClient();

  const { mutate } = trpc.users.updateRole.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(getQueryKey(trpc.users.findAll));
    },
  });

  const { mutate: deleteUserMutation, isLoading: isDeleteUserLoading } =
    trpc.users.delete.useMutation({
      onSuccess: () => {
        queryClient.invalidateQueries(getQueryKey(trpc.users.findAll));
      },
    });
  const { mutate: revokeInvitation, isLoading: isRevokeUserLoading } =
    trpc.users.revokeInvitation.useMutation({
      onSuccess: () => {
        queryClient.invalidateQueries(getQueryKey(trpc.users.getInvitations));
      },
    });

  const deleteUser = (user: User) => {
    if (user.pending) revokeInvitation({ id: user.id });
    else deleteUserMutation({ id: user.id });
  };

  const updateRole = (data: UserRoleUpdateType) => {
    mutate({ id: user.id, role: data.role || UserRole.BASIC });
  };

  const showUpdateRoleSelect =
    !user.pending &&
    clerkUser?.publicMetadata.isAdmin == true &&
    user.id != clerkUser.id;
  const showDeleteButton =
    clerkUser?.publicMetadata.isAdmin == true && user.id != clerkUser.id;

  return (
    <div className="mt-1 flex flex-row items-center justify-between rounded-md border py-1 pl-4 pr-3 text-gray-600">
      <div>{user.emailAddress}</div>
      <div
        className={`flex flex-row items-center ${!showDeleteButton && 'py-5'}`}
      >
        <>
          {showUpdateRoleSelect && (
            <Select
              onValueChange={(selected) =>
                updateRole({ role: selected as UserRole })
              }
              defaultValue={user.role || undefined}
            >
              <SelectTrigger className="w-20">
                <SelectValue placeholder="Select task priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                <SelectItem value={UserRole.BASIC}>Basic</SelectItem>
              </SelectContent>
            </Select>
          )}
          {user.pending && (
            <div className="rounded bg-yellow-400 px-3 py-1 text-white">
              Pending
            </div>
          )}
          {showDeleteButton && (
            <div>
              <AlertDialogButton
                handleAction={() => deleteUser(user)}
                buttonVariant="ghost"
                buttonClassName="ml-2 py-0 px-2"
                buttonText={<XIcon className="hover:cursor-pointer" />}
                title={`Delete user ${user.emailAddress}`}
                description="Are you sure you want to delete this user?"
                isActionLoading={isDeleteUserLoading || isRevokeUserLoading}
              />
            </div>
          )}
        </>
      </div>
    </div>
  );
};
export default Employee;
