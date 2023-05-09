import React from 'react';
import { Input } from "@components/input";
import { Button } from "@components/button";
import { trpc } from "@utils/trpc";

const Users = () => {
  const {mutate} = trpc.user.invite.useMutation()
  const sendInvitation = () => {
    mutate({ email: "semprimoznik.matevz@gmail.com"})
  }
  return <div>
    <Input type="text" placeholder="Add user" />
    <Button onClick={sendInvitation}/>
  </div>;
};

export default Users;