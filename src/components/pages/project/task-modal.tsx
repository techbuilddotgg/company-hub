import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AlertDialogButton,
  Button,
  Checkbox,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  LoaderButton,
  ScrollArea,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Separator,
  Textarea,
} from '@components';
import { trpc } from '@utils/trpc';
import { Send, User2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import PickDate from '@components/pages/project/pick-date';
import { ProjectBoardTask } from '@prisma/client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import add from 'date-fns/add';
import { format, isSameDay } from 'date-fns';
import { LabelColorsType } from '@components/pages/calendar/types';

export const commentSchema = z.object({
  comment: z
    .string()
    .min(3, { message: 'Enter at least 3 chars' })
    .max(500, { message: 'Enter max 500 chars' }),
});

export const taskSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Enter at least 3 chars' })
    .max(25, { message: 'Enter max 25 chars' }),
  description: z
    .string()
    .max(1000, { message: 'Please enter less that 1000 characters' }),
});

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
  taskPriorityName: string | undefined;
  taskTypeName: string | undefined;
}

export const TaskModal = ({
  refetch,
  setOpenTaskDialog,
  task,
  taskPriorityName,
  taskTypeName,
}: TaskModalProps) => {
  const user = useUser();

  const [selectedTaskType, setSelectedTaskType] = useState<string | undefined>(
    taskTypeName,
  );
  const [selectedTaskPriority, setSelectedTaskPriority] = useState<
    string | undefined
  >(taskPriorityName);

  const [date, setDate] = useState<Date | undefined>(
    task?.deadLine ? task?.deadLine : undefined,
  );

  const previousDateRef = useRef<Date | undefined>(
    task?.deadLine ? task?.deadLine : undefined,
  );

  useEffect(() => {
    if (taskTypeName) setSelectedTaskType(taskTypeName);
  }, [taskTypeName]);

  useEffect(() => {
    if (taskPriorityName) {
      setSelectedTaskPriority(taskPriorityName);
    }
  }, [taskPriorityName]);

  const {
    register,
    handleSubmit,
    formState: { errors: ticketErrors },
  } = useForm<FormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: task?.name,
      description: task?.description || '',
    },
  });

  const {
    register: registerComment,
    handleSubmit: handleSubmitComment,
    formState: { errors: commentErrors },
    reset: resetComment,
  } = useForm<FormDataComment>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comment: '',
    },
  });

  const { mutate: deleteTaskMutation, isLoading: isDeleteTaskLoading } =
    trpc.board.deleteTask.useMutation({
      onSuccess: () => {
        refetch();
        setOpenTaskDialog(false);
      },
    });

  const { data: assignedUsers, refetch: refetchAssignedUsers } =
    trpc.board.getUsersAssignedToTask.useQuery({ taskId: task.id });
  const { mutate: addUserToTask } = trpc.board.addUserToTask.useMutation({
    onSuccess: () => {
      refetchAssignedUsers();
      setOpenTaskDialog(true);
      refetch();
      if (date && assignedUsers) {
        updateEvent({
          title: task.name,
          description: `Task deadline set to ${format(date, 'PPP')}.`,
          start: date.toISOString(),
          end: add(date, { hours: 24 }).toISOString(),
          backgroundColor: LabelColorsType.BLUE,
          taskId: task.id,
          users: assignedUsers,
        });
      }
    },
  });

  const { mutate: commentTask } = trpc.board.commentTask.useMutation({
    onSuccess: () => {
      refetchComments();
      setOpenTaskDialog(true);
    },
  });

  const { data: comments, refetch: refetchComments } =
    trpc.board.getTaskComments.useQuery({ taskId: task.id });
  const { data: taskTypes } = trpc.board.getTaskTypes.useQuery();
  const { data: taskPriorities } = trpc.board.getTaskPriorities.useQuery();

  const { mutate: removeUserFromTask } =
    trpc.board.removeUserFromTask.useMutation({
      onSuccess: () => {
        refetchAssignedUsers();
        setOpenTaskDialog(true);
        refetch();
      },
    });

  const { data: users } = trpc.users.findAll.useQuery();

  const onUserCheckedChange = (userId: string, checked: string | boolean) => {
    if (checked) addUserToTask({ userId: userId, taskId: task.id });
    if (!checked) removeUserFromTask({ userId: userId, taskId: task.id });
  };

  const { mutate: updateTask, isLoading: isUpdateTaskLoadingMutation } =
    trpc.board.updateTask.useMutation({
      onSuccess: () => {
        refetch();
        setOpenTaskDialog(false);
      },
    });

  const { mutate: addEvent } = trpc.event.add.useMutation();
  const { mutate: updateEvent } = trpc.event.updateByTaskId.useMutation();
  const { mutate: deleteEvent, isLoading: isDeleteEventLoading } =
    trpc.event.deleteByTaskId.useMutation();
  const onSubmitTask = (data: FormData) => {
    const taskTypeId = taskTypes?.find(
      (taskType) => taskType.name === selectedTaskType,
    )?.id;
    const taskPriorityId = taskPriorities?.find(
      (taskPriority) => taskPriority.name === selectedTaskPriority,
    )?.id;
    updateTask({
      id: task.id,
      name: data.name,
      description: data.description,
      deadLine: date !== undefined ? date : null,
      taskTypeId: taskTypeId,
      taskPriorityId: taskPriorityId,
    });

    // add to calendar
    const nameChanged = data.name !== task.name;

    if (date === undefined && previousDateRef.current !== undefined) {
      deleteEvent(task.id);
    } else if (
      date !== undefined &&
      previousDateRef.current === undefined &&
      assignedUsers
    ) {
      addEvent({
        title: data.name,
        description: `Task deadline set to ${format(date, 'PPP')}.`,
        start: date.toISOString(),
        end: add(date, { hours: 24 }).toISOString(),
        backgroundColor: LabelColorsType.BLUE,
        taskId: task.id,
        users: assignedUsers,
      });
    } else if (
      date !== undefined &&
      previousDateRef.current !== undefined &&
      (!isSameDay(date, previousDateRef.current) || nameChanged) &&
      assignedUsers
    ) {
      updateEvent({
        title: data.name,
        description: `Task deadline set to ${format(date, 'PPP')}.`,
        start: date.toISOString(),
        end: add(date, { hours: 24 }).toISOString(),
        backgroundColor: LabelColorsType.BLUE,
        taskId: task.id,
        users: assignedUsers,
      });
    }
    previousDateRef.current = date;
  };

  const onSubmitComment = (data: FormDataComment) => {
    if (user.user?.id.toString() && user.user?.emailAddresses[0]?.emailAddress)
      commentTask({
        comment: data.comment,
        taskId: task.id,
        userId: user.user?.id.toString(),
        email: user.user?.emailAddresses[0]?.emailAddress,
      });
    resetComment();
  };

  const deleteTask = () => {
    deleteTaskMutation(task.id);
    deleteEvent(task.id);
  };

  const handleTaskTypeChange = (selected: string) => {
    setSelectedTaskType(selected);
  };

  const handleTaskPriorityChange = (selected: string) => {
    setSelectedTaskPriority(selected);
  };

  return (
    <DialogContent setDialogOpen={setOpenTaskDialog}>
      <DialogHeader>
        <DialogTitle>Task</DialogTitle>
      </DialogHeader>
      <ScrollArea className="max-h-[80vh] px-3">
        <Accordion type="single" collapsible>
          <AccordionItem value={'item-1'}>
            <AccordionTrigger>{`Edit task: ${task.name}`}</AccordionTrigger>
            <AccordionContent className="m-2">
              <form
                className={'flex flex-col gap-4 px-1'}
                onSubmit={handleSubmit(onSubmitTask)}
              >
                <Input
                  error={ticketErrors.name}
                  label={'Name*'}
                  {...register('name')}
                  defaultValue={task?.name}
                />
                <Textarea
                  error={ticketErrors.description}
                  label={'Description'}
                  {...register('description')}
                  defaultValue={task?.description || ''}
                  rows={5}
                />
                <div>
                  <p className="font-semibold">Deadline</p>
                  <PickDate date={date} setDate={setDate} />
                </div>
                <div>
                  <p className="font-semibold">Task type</p>
                  <Select
                    onValueChange={(selected) => handleTaskTypeChange(selected)}
                    defaultValue={selectedTaskType}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select task type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Types</SelectLabel>
                        {taskTypes &&
                          taskTypes.map((taskType) => (
                            <SelectItem
                              key={taskType.name}
                              value={taskType.name}
                            >
                              {taskType.name}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="font-semibold">Task priority</p>
                  <Select
                    onValueChange={(selected) =>
                      handleTaskPriorityChange(selected)
                    }
                    defaultValue={selectedTaskPriority}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select task priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Priorities</SelectLabel>
                        {taskPriorities &&
                          taskPriorities.map((taskPriority) => (
                            <SelectItem
                              key={taskPriority.name}
                              value={taskPriority.name}
                            >
                              {taskPriority.name}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-between">
                  <AlertDialogButton
                    handleAction={deleteTask}
                    buttonVariant={'outline'}
                    buttonText={'Delete'}
                    title={'Delete task'}
                    description={'Are you sure you want to delete this task?'}
                    isActionLoading={
                      isDeleteTaskLoading || isDeleteEventLoading
                    }
                  />
                  <LoaderButton
                    isLoading={isUpdateTaskLoadingMutation}
                    type={'submit'}
                  >
                    Update
                  </LoaderButton>
                </div>
              </form>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value={'item-2'}>
            <AccordionTrigger>{`Assign user to task (${
              assignedUsers?.length ? assignedUsers?.length : 0
            })`}</AccordionTrigger>
            <AccordionContent className="m-2">
              <ScrollArea className="h-44 w-72 rounded-md border">
                <div className="p-4">
                  {users &&
                    users.map((user) => (
                      <div
                        className="items-top my-2 flex space-x-2"
                        key={user.id}
                      >
                        <Checkbox
                          id={`terms${user.id}`}
                          checked={
                            assignedUsers
                              ? assignedUsers.includes(user.id)
                              : false
                          }
                          onCheckedChange={(checked) =>
                            onUserCheckedChange(user.id, checked)
                          }
                        />
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
          <AccordionItem value={'item-3'}>
            <AccordionTrigger>{`Comments (${comments?.length})`}</AccordionTrigger>
            <AccordionContent className="m-2">
              <form
                className="p-1"
                onSubmit={handleSubmitComment(onSubmitComment)}
              >
                <div className="mb-2 flex w-full space-x-2">
                  <Input
                    error={commentErrors.comment}
                    {...registerComment('comment')}
                    placeholder="Comment"
                  />
                  <Button type="submit" variant="secondary">
                    <Send color="black" size={22} />
                  </Button>
                </div>
              </form>
              <ScrollArea className="h-96 w-full rounded-md border">
                <div className="p-4">
                  {comments &&
                    comments.map((comment) => (
                      <div key={comment.id}>
                        <p key={comment.authorId} className="font-bold">
                          {comment.text}
                        </p>
                        <div className="mt-1 flex items-center">
                          <User2 color="gray" size={18} />
                          <p className="ml-2">{`${comment.email}`}</p>
                        </div>
                        <Separator className="my-4" />
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </DialogContent>
  );
};
