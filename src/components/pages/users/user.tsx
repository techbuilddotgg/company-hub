import { User as UserType } from '@clerk/backend';
import React from 'react';
import { XCircle } from 'lucide-react';

interface UserProps {
  user: UserType;
  deleteUser: (id: string) => void;
}
const User = ({ user, deleteUser }: UserProps) => {
  return (
    <div className="mt-1 flex flex-row justify-between rounded-md border p-3 text-gray-600">
      <div>{user.emailAddresses[0]?.emailAddress || user.username}</div>
      <div>
        <XCircle
          className="hover:cursor-pointer"
          onClick={() => deleteUser(user.id)}
        />
      </div>
    </div>
  );
};
export default User;
