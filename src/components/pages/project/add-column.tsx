import React from 'react';
import { trpc } from '@utils/trpc';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Input, LoaderButton } from '@components';

export const AddColumnSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Enter at least 3 chars' })
    .max(20, { message: 'Enter max 20 chars' }),
});

type AddColumnType = z.infer<typeof AddColumnSchema>;

interface AddColumnProps {
  boardId: string;
  refetch: () => void;
}
const AddColumn = ({ boardId, refetch }: AddColumnProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(AddColumnSchema),
    defaultValues: {
      name: '',
      boardName: '',
    },
  });
  const { mutate: addColumn, isLoading } = trpc.board.addColumn.useMutation({
    onSuccess: () => refetch(),
  });
  const onSubmit = (data: AddColumnType) => {
    addColumn({ ...data, boardId });
    reset();
  };
  return (
    <div className="flex flex-row items-start">
      <Card className="bg-gray-100">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-row items-center gap-4"
        >
          <Input
            error={errors.name}
            type="text"
            id="name"
            {...register('name')}
          />
          <LoaderButton
            isLoading={isLoading}
            type="submit"
            className="w-44"
            variant="ghost"
          >
            + Add a column
          </LoaderButton>
        </form>
      </Card>
    </div>
  );
};
export default AddColumn;
