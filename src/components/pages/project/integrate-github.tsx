import { trpc } from '@utils/trpc';
import {
  Button,
  Label,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddWebhookSchema } from '../../../shared/validators/github.schemes';
import { AddWebhookType } from '../../../shared/types/github.types';

interface IntegrateGithubProps {
  boardId: string;
}
const IntegrateGithub = ({ boardId }: IntegrateGithubProps) => {
  const { handleSubmit, setValue } = useForm({
    resolver: zodResolver(AddWebhookSchema),
    defaultValues: {
      repositoryId: '',
    },
  });
  const { data: repositories } = trpc.github.getRepositories.useQuery();
  const { mutate: addWebhook } = trpc.github.addWebhook.useMutation();

  const onSubmit = (data: AddWebhookType) => {
    const repository = repositories?.find(
      (repo) => repo.id.toString() === data.repositoryId,
    );
    if (repository)
      addWebhook({
        boardId,
        repositoryName: repository.name,
        repositoryOwner: repository.owner.login,
      });
  };

  if (!repositories) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Label className="text-md mb-2">Select repository</Label>
      <Select onValueChange={(value) => setValue('repositoryId', value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Repo" />
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className="h-[200px] w-[350px] rounded-md">
            {repositories.map((repository) => (
              <SelectItem
                key={repository.name}
                value={repository.id.toString()}
              >
                {repository.name}
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>
      <Button type="submit">Save</Button>
    </form>
  );
};
export default IntegrateGithub;
