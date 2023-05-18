import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
  Button,
  Checkbox,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input, ScrollArea,
  Textarea,
  Separator, Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem
} from "@components";
import { trpc } from "@utils/trpc";
import { Trash2, Send } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import PickDate from "@components/pages/project/pick-date";
import { ProjectBoardTask } from "@prisma/client";
import { useToast } from "@hooks";

interface FormData {
  name: string;
  description: string;
}

interface FormDataComment {
  comment: string;
}


interface TaskModalProps {
  refetch: () => void;
  setOpenTaskDialog: (open: boolean) => void;
  task: ProjectBoardTask;
}

export const TaskModal = ({
  refetch,
  setOpenTaskDialog,
  task
}: TaskModalProps) => {

  const user = useUser();
  const { toast } = useToast();

  const {data: taskType} = trpc.board.getTaskType.useQuery({ taskTypeId: task.taskTypeId || ''});

  const [selectedTaskType, setSelectedTaskType] = useState<string | undefined >( taskType?.name)
  const [date, setDate] = useState<Date | undefined >(task?.deadLine ? task?.deadLine: undefined)


  useEffect(() => {
    if(taskType && typeof taskType.name === 'string')
      setSelectedTaskType(taskType.name)
  }, [taskType]);

  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: task?.name,
      description: task?.description || '',
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

  const {data: assignedUsers, refetch: refetchAssignedUsers} = trpc.board.getUsersAssignedToTask.useQuery({ taskId: task.id});
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

  const {data: comments, refetch: refetchComments} = trpc.board.getTaskComments.useQuery({ taskId: task.id});
  const {data: taskTypes} = trpc.board.getTaskTypes.useQuery();

  const { mutate: removeUserFromTask } = trpc.board.removeUserFromTask.useMutation({
    onSuccess: () => {
      refetchAssignedUsers()
      setOpenTaskDialog(true);
    },
  });

  const { data: users } = trpc.users.findAll.useQuery();

  const onUserCheckedChange = (userId: string, checked: string |boolean) => {
    if(checked)
      addUserToTask({ userId: userId, taskId: task.id })
    if(!checked)
      removeUserFromTask({ userId: userId, taskId: task.id })
  }

  const { mutate: updateTask } = trpc.board.updateTask.useMutation({
    onSuccess: () => {
      refetch()
      setOpenTaskDialog(false);
    },
  });

  const onSubmitTask = (data: FormData) => {
    const taskId = taskTypes?.find(taskType => taskType.name === selectedTaskType)?.id;
    updateTask({ id: task.id, name: data.name, description: data.description, deadLine: date, taskTypeId: taskId})
    toast({ title: "Task update", description: "Task was updated successfully."})
  };

  const onSubmitComment = (data: FormDataComment) => {
    if(user.user?.id.toString() && user.user?.emailAddresses[0]?.emailAddress)
      commentTicket({ comment: data.comment, taskId: task.id, userId: user.user?.id.toString(), email: user.user?.emailAddresses[0]?.emailAddress})
    resetComment()
  };

  const deleteTask = () => {
    deleteTaskMutation(task.id);
  };

  const handleTaskTypeChange = (selected: string) => {
    setSelectedTaskType(selected);
  };

  return (
    <DialogContent setDialogOpen={setOpenTaskDialog}>
      <DialogHeader>
        <DialogTitle>Task</DialogTitle>
      </DialogHeader>
      <Accordion type="single" collapsible>
        <AccordionItem value={"item-1"} >
          <AccordionTrigger>{`Edit task: ${task.name}`}</AccordionTrigger>
          <AccordionContent className='m-2'>
            <form className={'flex flex-col gap-4'} onSubmit={handleSubmit(onSubmitTask)}>
              <Input  label={'Name'} {...register('name')} defaultValue={task?.name} />
              <Textarea label={'Description'} {...register('description') } defaultValue={task?.description || ''} rows={5} />
              <p className='font-semibold'>Deadline</p>
              <PickDate date={date} setDate={setDate} />
              <p className='font-semibold'>Task type</p>
              <Select onValueChange={(selected) => handleTaskTypeChange(selected)} defaultValue={selectedTaskType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Types</SelectLabel>
                    {taskTypes && taskTypes.map((taskType) => (
                      <SelectItem key={taskType.name} value={taskType.name}>{taskType.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div className="flex justify-between">
                <Button onClick={deleteTask} variant="ghost" type="submit">
                  <Trash2 color="black" size={22} />
                </Button>
                <Button type={'submit'}>Update</Button>
              </div>
            </form>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value={"item-2"}>
          <AccordionTrigger>{`Assign user to task (${assignedUsers?.length ? assignedUsers?.length : 0})`}</AccordionTrigger>
          <AccordionContent className='m-2'>
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
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value={"item-3"}>
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
                  <div key={comment.id}>
                    <p key={comment.authorId} className='font-bold'>{comment.text}</p>
                    <p className='ml-4'>{`~ ${comment.email}`}</p>
                    <Separator className="my-4" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </DialogContent>

  );
};


