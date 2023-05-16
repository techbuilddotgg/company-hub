import React from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Checkbox,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input, ScrollArea,
  Textarea
} from "@components";
import { trpc } from "@utils/trpc";
import { Trash2 } from "lucide-react";

interface FormData {
  name: string;
  description: string;
}

interface TaskModalProps {
  id: string;
  refetch: () => void;
  setOpenTaskDialog: (open: boolean) => void;
}

export const TaskModal = ({
  id,
  refetch,
  setOpenTaskDialog,
}: TaskModalProps) => {
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const { mutate: deleteTaskMutation } = trpc.board.deleteTask.useMutation({
    onSuccess: () => {
      refetch();
      setOpenTaskDialog(false);
    },
  });

  const {data: assignedUsers, refetch: refetchAssignedUsers} = trpc.board.getUsersAssignedToTask.useQuery({ taskId: id});
  const { mutate: addUserToTask } = trpc.board.addUserToTask.useMutation({
    onSuccess: () => {
      refetchAssignedUsers()
      setOpenTaskDialog(true);
    },
  });

  const { mutate: removeUserFromTask } = trpc.board.removeUserFromTask.useMutation({
    onSuccess: () => {
      refetchAssignedUsers()
      setOpenTaskDialog(true);
    },
  });

  const { data: users } = trpc.users.findAll.useQuery();

  const onUserCheckedChange = (userId: string, checked: string |boolean) => {
    if(checked)
      addUserToTask({ userId: userId, taskId: id })
    if(!checked)
      removeUserFromTask({ userId: userId, taskId: id })
  }

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  const deleteTask = () => {
    deleteTaskMutation(id);
  };

  return (
    <DialogContent setDialogOpen={setOpenTaskDialog}>
      <DialogHeader>
        <DialogTitle>Ticket</DialogTitle>
        <DialogDescription>
          Assign user to ticket:
        </DialogDescription>
      </DialogHeader>
      <ScrollArea className="h-44 w-72 rounded-md border">
        <div className="p-4">
        {users && users.map((user) => (
          <div className="items-top flex space-x-2 my-2" key={user.id}>
            <Checkbox id={`terms${user.id}`} checked={assignedUsers ? assignedUsers.includes(user.id) : false} onCheckedChange={(checked) => onUserCheckedChange(user.id, checked)} />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor={`terms${user.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {user.emailAddresses[0]?.emailAddress}
              </label>
            </div>
          </div>
        ))}
        </div>
      </ScrollArea>
      <form className={'flex flex-col gap-4'} onSubmit={handleSubmit(onSubmit)}>
        <Input label={'Name'} {...register('name')} />
        <Textarea label={'Description'} {...register('description')} rows={5} />
        <div className="flex justify-between">
          <Button onClick={deleteTask} variant="ghost" type="submit">
            <Trash2 color="black" size={22} />
          </Button>
          <Button type={'submit'}>Update</Button>
        </div>

      </form>
    </DialogContent>

  );
};


