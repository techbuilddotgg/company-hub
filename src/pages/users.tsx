import React from 'react';
import { trpc } from '@utils/trpc';
import { Button, Input } from '@components';
import User from '@components/pages/users/user';

const Users = () => {
  const { mutate } = trpc.users.invite.useMutation();
  const { data: users, refetch: refetchUsers } = trpc.users.findAll.useQuery();

  const { mutate: deleteUserMutation } = trpc.users.delete.useMutation({
    onSuccess: () => {
      refetchUsers();
    },
  });
  const sendInvitation = () => {
    mutate({ email: 'semprimoznik.matevz@gmail.com' });
  };

  const deleteUser = (id: string) => {
    deleteUserMutation({ id });
  };

  return (
    <div>
      <h1 className="mb-8 text-4xl">Users</h1>
      <div className="flex flex-row">
        <Input type="text" placeholder="Add new user" className="mr-5" />
        <Button className="w-32" onClick={sendInvitation}>
          Invite user
        </Button>
      </div>
      {users && (
        <div className="mt-14">
          {users.map((user) => (
            <User key={user.id} user={user} deleteUser={deleteUser} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;
