import React from 'react';
import { trpc } from '@utils/trpc';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from "@components";

export const AddTaskSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Enter at least 3 chars' })
    .max(20, { message: 'Max is 20' }),
});

type AddTaskType = z.infer<typeof AddTaskSchema>;

interface AddTaskProps {
  columnId: string;
  refetch: () => void;
}
const AddTask = ({ columnId, refetch }: AddTaskProps) => {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(AddTaskSchema),
    defaultValues: {
      name: '',
    },
  });
  const { mutate: addTask } = trpc.board.addTask.useMutation({
    onSuccess: () => refetch(),
  });
  const onSubmit = (data: AddTaskType) => {
    addTask({ ...data, columnId });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row items-center">
      <Input type="text" id="name" {...register('name')} />
      <Button variant="ghost" type="submit" className='w-44'>+ Add a card</Button>
    </form>
  );
};
export default AddTask;
