import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, DialogContent, Input, Textarea } from '@components';
import { trpc } from '@utils/trpc';

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

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  const deleteTask = () => {
    deleteTaskMutation(id);
  };

  return (
    <DialogContent setDialogOpen={setOpenTaskDialog}>
      <form className={'flex flex-col gap-4'} onSubmit={handleSubmit(onSubmit)}>
        <Input label={'Name'} {...register('name')} />
        <Textarea label={'Description'} {...register('description')} rows={5} />
        <div className="flex justify-between">
          <Button onClick={deleteTask} type={'submit'} variant="destructive">
            Delete
          </Button>
          <Button type={'submit'}>Update</Button>
        </div>
      </form>
    </DialogContent>
  );
};
