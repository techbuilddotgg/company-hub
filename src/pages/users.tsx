import React from 'react';
import { trpc } from '@utils/trpc';
import {
  Button,
  Input,
  PageHeader,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components';
import User from '@components/pages/users/user';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserInviteSchema } from '@shared/validators/user.schemes';
import { UserInviteType, UserRole } from '@shared/types/user.types';
import { useUser } from '@clerk/nextjs';

const Users = () => {
  const { register, setValue, handleSubmit } = useForm({
    resolver: zodResolver(UserInviteSchema),
    defaultValues: {
      email: '',
      isAdmin: false,
    },
  });
  const { user } = useUser();
  const { mutate } = trpc.users.invite.useMutation();
  const { data: users, refetch: refetchUsers } = trpc.users.findAll.useQuery();

  const { mutate: deleteUserMutation } = trpc.users.delete.useMutation({
    onSuccess: () => {
      refetchUsers();
    },
  });
  const sendInvitation = (data: UserInviteType) => {
    console.log(data);
    mutate(data);
  };

  const deleteUser = (id: string) => {
    deleteUserMutation({ id });
  };

  return (
    <div>
      <PageHeader className="mb-8" title="Users" />
      <>
        {user?.publicMetadata.isAdmin && (
          <form
            className="flex flex-col md:flex-row"
            onSubmit={handleSubmit(sendInvitation)}
          >
            <Input
              {...register('email')}
              type="text"
              placeholder="Add new user"
            />
            <div className="ml-0 mt-3 flex flex-row md:ml-3 md:mt-0">
              <Select
                onValueChange={(selected) =>
                  setValue('isAdmin', selected === UserRole.ADMIN)
                }
                defaultValue={UserRole.BASIC}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Select task priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                  <SelectItem value={UserRole.BASIC}>Basic</SelectItem>
                </SelectContent>
              </Select>
              <Button className="ml-3 w-32" type="submit">
                Invite user
              </Button>
            </div>
          </form>
        )}
      </>
      {users && (
        <div className="mt-10">
          {users.map((user) => (
            <User key={user.id} user={user} deleteUser={deleteUser} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;
