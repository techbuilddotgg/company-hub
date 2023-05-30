import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserInviteSchema } from '@shared/validators/user.schemes';
import { trpc } from '@utils/trpc';
import {
  Input,
  LoaderButton,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components';
import { UserInviteType, UserRole } from '@shared/types/user.types';
import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';

const InviteUser = () => {
  const queryClient = useQueryClient();
  const { register, setValue, handleSubmit, reset, formState } = useForm({
    resolver: zodResolver(UserInviteSchema),
    defaultValues: {
      email: '',
      isAdmin: false,
    },
  });

  const { mutate, isLoading } = trpc.users.invite.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(getQueryKey(trpc.users.getInvitations));
      reset();
    },
  });

  const sendInvitation = (data: UserInviteType) => {
    mutate(data);
  };

  return (
    <form
      className="mb-5 flex flex-col md:flex-row"
      onSubmit={handleSubmit(sendInvitation)}
    >
      <Input
        {...register('email')}
        type="text"
        placeholder="Add new user"
        error={formState.errors.email}
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
        <LoaderButton isLoading={isLoading} className="ml-3 w-32" type="submit">
          Invite user
        </LoaderButton>
      </div>
    </form>
  );
};
export default InviteUser;
