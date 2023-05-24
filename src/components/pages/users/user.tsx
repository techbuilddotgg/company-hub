import React from 'react';
import { XIcon } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { AlertDialogButton } from '@components';

interface UserProps {
  user: {
    id: string;
    emailAddress: string;
    pending: boolean;
  };
  deleteUser: (user: {
    id: string;
    emailAddress: string;
    pending: boolean;
  }) => void;
  pending?: boolean;
}

const User = ({ user, deleteUser }: UserProps) => {
  const { user: clerkUser } = useUser();
  return (
    <div className="mt-1 flex flex-row items-center justify-between rounded-md border px-3 py-1 text-gray-600">
      <div>{user.emailAddress}</div>
      <div className="flex flex-row items-center">
        <>
          {user.pending && (
            <div className="rounded bg-yellow-400 px-3 py-1 text-white">
              Pending
            </div>
          )}
          {clerkUser?.publicMetadata.isAdmin && (
            <div>
              <AlertDialogButton
                handleAction={() => deleteUser(user)}
                buttonVariant="ghost"
                buttonClassName="ml-2 py-0 px-2"
                buttonText={<XIcon className="hover:cursor-pointer" />}
                title={`Delete user ${user.emailAddress}`}
                description="Are you sure you want to delete this user?"
              />
            </div>
          )}
        </>
      </div>
    </div>
  );
};
export default User;
