import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '@utils/trpc';
import { Input, LoaderButton, Textarea } from '@components';
import { AddProjectSchema } from '@shared/validators/project.schemes';
import { AddProjectType, ProjectWithBoards } from '@shared/types/project.types';
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(AddProjectSchema),
    defaultValues: {
      name: project?.name || '',
      boardName: project?.projectBoards[0]?.name || '',
      description: project?.description || '',
      abbreviation: project?.abbreviation || '',
    },
  });
  const { mutate: addProject, isLoading: isAddProjectMutationLoading } =
    trpc.project.add.useMutation({
      onSuccess: () => {
        refetchProjects();
        setDialogOpened(false);
      },
    });

  const { mutate: updateProject, isLoading: isUpdateProjectMutationLoading } =
    trpc.project.update.useMutation({
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
        <Input error={errors.name} label="Name" {...register('name')} />
        <Input
          error={errors.abbreviation}
          label="Abbreviation"
          {...register('abbreviation')}
        />
        <Textarea
          error={errors.description}
          rows={5}
          label="Description"
          {...register('description')}
        />
        <Input
          error={errors.boardName}
          label="Board name"
          {...register('boardName')}
        />
        <LoaderButton
          isLoading={
            isAddProjectMutationLoading || isUpdateProjectMutationLoading
          }
          className="mt-5 self-end"
          type="submit"
        >
          Save
        </LoaderButton>
      </form>
    </div>
  );
};
export default SaveProjectForm;
