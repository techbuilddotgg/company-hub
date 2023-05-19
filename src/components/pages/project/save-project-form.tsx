import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '@utils/trpc';
import { Button, Input, Textarea } from '@components';
import { AddProjectSchema } from '../../../shared/validators/project.schemes';
import {
  AddProjectType,
  ProjectWithBoards,
} from '../../../shared/types/project.types';
import React from 'react';

interface SaveProjectFormProps {
  project?: ProjectWithBoards;
  refetchProjects: () => void;
  setDialogOpened: (open: boolean) => void;
}
const SaveProjectForm = ({
  refetchProjects,
  setDialogOpened,
  project,
}: SaveProjectFormProps) => {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(AddProjectSchema),
    defaultValues: {
      name: project?.name || '',
      boardName: project?.projectBoards[0]?.name || '',
      description: project?.description || '',
    },
  });
  const { mutate: addProject } = trpc.project.add.useMutation({
    onSuccess: () => {
      refetchProjects();
      setDialogOpened(false);
    },
  });

  const { mutate: updateProject } = trpc.project.update.useMutation({
    onSuccess: () => {
      refetchProjects();
      setDialogOpened(false);
    },
  });

  const onSubmit = (data: AddProjectType) => {
    if (project) updateProject({ ...project, ...data });
    else addProject(data);
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
export default SaveProjectForm;
