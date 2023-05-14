import React from 'react';
import { trpc } from '@utils/trpc';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@components';

export const AddColumnSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Enter at least 3 chars' })
    .max(20, { message: 'Max is 20' }),
});

type AddColumnType = z.infer<typeof AddColumnSchema>;

interface AddColumnProps {
  boardId: string;
  refetch: () => void;
}
const AddColumn = ({ boardId, refetch }: AddColumnProps) => {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(AddColumnSchema),
    defaultValues: {
      name: '',
      boardName: '',
    },
  });
  const { mutate: addColumn } = trpc.board.addColumn.useMutation({
    onSuccess: () => refetch(),
  });
  const onSubmit = (data: AddColumnType) => {
    addColumn({ ...data, boardId });
  };
  return (
    <div className="flex h-72 w-52 items-center justify-center bg-blue-100">
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="name">Name</label>
          <Input type="text" id="name" {...register('name')} />
          <button type="submit">Add</button>
        </form>
      </div>
    </div>
  );
};
export default AddColumn;
