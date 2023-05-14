import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '@utils/trpc';
import { Input } from '@components';

export const AddProjectSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Enter at least 3 chars' })
    .max(20, { message: 'Max is 20' }),
  boardName: z
    .string()
    .min(3, { message: 'Enter at least 3 chars' })
    .max(20, { message: 'Max is 20' }),
});

type AddProjectType = z.infer<typeof AddProjectSchema>;

const AddProjectForm = () => {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(AddProjectSchema),
    defaultValues: {
      name: '',
      boardName: '',
    },
  });
  const { mutate: addProject } = trpc.project.add.useMutation();

  const onSubmit = (data: AddProjectType) => {
    addProject(data);
  };

  return (
    <div>
      <h1>Add Project Form</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">Name</label>
        <Input type="text" id="name" {...register('name')} />
        <label htmlFor="name">Baord name</label>
        <Input type="text" id="board-name" {...register('boardName')} />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};
export default AddProjectForm;
