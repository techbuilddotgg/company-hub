import React from 'react';
import { trpc } from '@utils/trpc';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Input, Button } from "@components";


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
    <div className="flex flex-row items-start">
      <Card className='bg-gray-100'>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row p-4 items-center gap-4">
          <Input type="text" id="name" {...register('name')} />
          <Button type="submit" className='w-44'>+ Add a column</Button>
        </form>
      </Card>
    </div>
  );
};
export default AddColumn;
