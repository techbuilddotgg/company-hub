import React, { useMemo } from 'react';
import { trpc } from '@utils/trpc';
import { DataView, PageHeader, ScrollArea } from '@components';
import Employee from '@components/pages/users/employee';
import { useUser } from '@clerk/nextjs';
import InviteUser from '@components/pages/users/invite-user';
import { User, UserRole } from '@shared/types/user.types';

const Employees = () => {
  const { user } = useUser();
  const { data: users, isLoading: isUsersLoading } =
    trpc.users.findAll.useQuery();
  const { data: invitations, isLoading: isInvitationsLoading } =
    trpc.users.getInvitations.useQuery();

  console.log(invitations);

  const usersToDisplay = useMemo(() => {
    const usersToDisplay: User[] =
      users?.map((user) => ({
        id: user.id,
        emailAddress: user.emailAddresses[0]?.emailAddress || 'Not defined',
        pending: false,
        role: user.publicMetadata.isAdmin ? UserRole.ADMIN : UserRole.BASIC,
      })) || [];
    if (invitations)
      usersToDisplay.push(
        ...invitations.map((invitation) => ({
          id: invitation.id,
          emailAddress: invitation.email_address || 'Not defined',
          pending: true,
          role: null,
        })),
      );
    return usersToDisplay;
  }, [users, invitations]);

  return (
    <div>
      <PageHeader className="mb-8" title="Employees" />
      <>{user?.publicMetadata.isAdmin && <InviteUser />}</>
      <DataView<User[]>
        isLoading={isUsersLoading || isInvitationsLoading}
        data={usersToDisplay}
        fallback={<div>No users</div>}
      >
        {(data) => (
          <ScrollArea className="mt-5 h-[80vh]">
            {data.map((user) => (
              <Employee key={user.id} user={user} />
            ))}
          </ScrollArea>
        )}
      </DataView>
    </div>
  );
};

export default Employees;
