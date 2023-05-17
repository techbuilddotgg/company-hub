import React from "react";
import { useForm } from "react-hook-form";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
  Button,
  Checkbox,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input, ScrollArea,
  Textarea,
  Separator
} from "@components";
import { trpc } from "@utils/trpc";
import { Trash2, Send } from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface FormData {
  name: string;
  description: string;
}

interface FormDataComment {
  comment: string;
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

  const user = useUser();


  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const { register: registerComment, handleSubmit: handleSubmitComment , reset: resetComment} = useForm<FormDataComment>({
    defaultValues: {
      comment: '',
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

  const { mutate: commentTicket } = trpc.board.commentTicket.useMutation({
    onSuccess: () => {
      refetchComments()
      setOpenTaskDialog(true);
    },
  });

  const {data: comments, refetch: refetchComments} = trpc.board.getTaskComments.useQuery({ taskId: id});


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

  const onSubmitComment = (data: FormDataComment) => {
    if(user.user?.id.toString() && user.user?.emailAddresses[0]?.emailAddress)
      commentTicket({ comment: data.comment, taskId: id, userId: user.user?.id.toString(), email: user.user?.emailAddresses[0]?.emailAddress})
    resetComment()
  };

  const deleteTask = () => {
    deleteTaskMutation(id);
  };

  return (
    <DialogContent setDialogOpen={setOpenTaskDialog}>
      <DialogHeader>
        <DialogTitle>Ticket</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        Edit ticket:
      </DialogDescription>
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
      <Separator className="my-2" />
      <DialogDescription>
        Assign user to ticket:
      </DialogDescription>
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
      <Accordion type="single" collapsible>
        <AccordionItem value={"item"}>
          <AccordionTrigger>{`Comments (${comments?.length})`}</AccordionTrigger>
          <AccordionContent className='m-2'>
            <form onSubmit={handleSubmitComment(onSubmitComment)}>
              <div className="flex w-full max-w-sm items-center space-x-2 mb-2">
                <Input {...registerComment('comment')} placeholder="Comment" />
                <Button type="submit" variant="secondary">            <Send color="black" size={22} />
                </Button>
              </div>
            </form>

            <ScrollArea className="h-44 w-full rounded-md border">
              <div className="p-4">
                {comments && comments.map((comment) => (
                  <>
                    <p key={comment.authorId} className='font-bold'>{comment.text}</p>
                    <p className='ml-4'>{`~ ${comment.email}`}</p>
                    <Separator className="my-4" />
                  </>
                ))}
              </div>

            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

    </DialogContent>

  );
};


