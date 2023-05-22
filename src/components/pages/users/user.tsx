import type { User as UserType } from '@clerk/nextjs/dist/api';
import React from 'react';
import { XCircle } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

interface UserProps {
  user: UserType;
  deleteUser: (id: string) => void;
}

const User = ({ user, deleteUser }: UserProps) => {
  const { user: clerkUser } = useUser();
  return (
    <div className="mt-1 flex flex-row justify-between rounded-md border p-3 text-gray-600">
      <div>{user.emailAddresses[0]?.emailAddress || user.username}</div>
      <>
        {clerkUser?.publicMetadata.isAdmin && (
          <div>
            <XCircle
              className="hover:cursor-pointer"
              onClick={() => deleteUser(user.id)}
            />
          </div>
        )}
      </>
    </div>
  );
};
export default User;
