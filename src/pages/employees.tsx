import React, { useMemo } from 'react';
import { trpc } from '@utils/trpc';
import { DataView, PageHeader } from '@components';
import Employee from '@components/pages/users/employee';
import { useUser } from '@clerk/nextjs';
import InviteUser from '@components/pages/users/invite-user';

const Employees = () => {
  const { user } = useUser();
  const {
    data: users,
    refetch: refetchUsers,
    isLoading: isUsersLoading,
  } = trpc.users.findAll.useQuery();
  const {
    data: invitations,
    refetch: refetchInvitations,
    isLoading: isInvitationsLoading,
  } = trpc.users.getInvitations.useQuery();

  const usersToDisplay = useMemo(() => {
    const usersToDisplay =
      users?.map((user) => ({
        id: user.id,
        emailAddress: user.emailAddresses[0]?.emailAddress || 'Not defined',
        pending: false,
      })) || [];
    if (invitations)
      usersToDisplay.push(
        ...invitations.map((invitation) => ({
          id: invitation.id,
          emailAddress: invitation.emailAddress || 'Not defined',
          pending: true,
        })),
      );
    return usersToDisplay;
  }, [users, invitations]);

  const { mutate: deleteUserMutation } = trpc.users.delete.useMutation({
    onSuccess: () => {
      refetchUsers();
      refetchInvitations();
    },
  });
  const { mutate: revokeInvitation } = trpc.users.revokeInvitation.useMutation({
    onSuccess: () => {
      refetchUsers();
      refetchInvitations();
    },
  });

  const deleteUser = (user: {
    id: string;
    emailAddress: string;
    pending: boolean;
  }) => {
    if (user.pending) revokeInvitation({ id: user.id });
    else deleteUserMutation({ id: user.id });
  };

  return (
    <div>
      <PageHeader className="mb-8" title="Employees" />
      <>{user?.publicMetadata.isAdmin && <InviteUser />}</>
      <DataView<{ id: string; emailAddress: string; pending: boolean }[]>
        isLoading={isUsersLoading || isInvitationsLoading}
        data={usersToDisplay}
        fallback={<div>No users</div>}
      >
        {(data) => (
          <div className="mt-10">
            {data.map((user) => (
              <Employee key={user.id} user={user} deleteUser={deleteUser} />
            ))}
          </div>
        )}
      </DataView>
    </div>
  );
};

export default Employees;
