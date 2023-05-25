import React from 'react';
import { trpc } from '@utils/trpc';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, LoaderButton } from '@components';

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
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(AddTaskSchema),
    defaultValues: {
      name: '',
    },
  });
  const { mutate: addTask, isLoading } = trpc.board.addTask.useMutation({
    onSuccess: () => refetch(),
  });
  const onSubmit = (data: AddTaskType) => {
    addTask({ ...data, columnId });
    reset();
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-row items-center"
    >
      <Input type="text" id="name" {...register('name')} />
      <LoaderButton
        isLoading={isLoading}
        variant="ghost"
        type="submit"
        className="ml-2 w-44"
      >
        + Add a card
      </LoaderButton>
    </form>
  );
};
export default AddTask;
