import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '@utils/trpc';
import { Button, Input, Textarea } from '@components';
import { AddProjectSchema } from '../../../shared/validators/project.schemes';
import { AddProjectType } from '../../../shared/types/project.types';
import React from 'react';

interface AddProjectFormProps {
  refetchProjects: () => void;
  setDialogOpened: (open: boolean) => void;
}
const AddProjectForm = ({
  refetchProjects,
  setDialogOpened,
}: AddProjectFormProps) => {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(AddProjectSchema),
    defaultValues: {
      name: '',
      boardName: '',
      description: '',
    },
  });
  const { mutate: addProject } = trpc.project.add.useMutation({
    onSuccess: () => {
      refetchProjects();
      setDialogOpened(false);
    },
  });

  const onSubmit = (data: AddProjectType) => {
    addProject(data);
  };

  return (
    <div>
      <h3>Save Project</h3>
      <form
        className="mt-5 flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input label="Name" {...register('name')} />
        <Textarea rows={5} label="Description" {...register('description')} />
        <Input label="Board name" {...register('boardName')} />
        <Button className="mt-5 self-end" type="submit">
          Save
        </Button>
      </form>
    </div>
  );
};
export default AddProjectForm;
