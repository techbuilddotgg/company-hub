import { RouterOutput, trpc } from '@utils/trpc';
import {
  Button,
  DataView,
  Label,
  LoaderButton,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddWebhookSchema } from '@shared/validators/github.schemes';
import { AddWebhookType } from '@shared/types/github.types';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';

type Repositories = RouterOutput['github']['getRepositories'];
interface IntegrateGithubProps {
  boardId: string;
  closeDialog: () => void;
}
const IntegrateGithub = ({ boardId, closeDialog }: IntegrateGithubProps) => {
  const queryClient = useQueryClient();
  const { handleSubmit, setValue } = useForm({
    resolver: zodResolver(AddWebhookSchema),
    defaultValues: {
      repositoryId: '',
    },
  });
  const {
    data: repositories,
    error,
    isLoading: areRepositoriesLoading,
  } = trpc.github.getRepositories.useQuery(undefined, {
    retry: false,
  });
  const { mutate: addWebhook, isLoading } = trpc.github.addWebhook.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(getQueryKey(trpc.github.isIntegrated));
      closeDialog();
    },
  });

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
  console.log(error);
  if (error)
    return (
      <div>
        <p>{error.message}</p>
        <Button variant="outline" className="mt-3" onClick={closeDialog}>
          Close
        </Button>
      </div>
    );

  return (
    <DataView<Repositories>
      isLoading={areRepositoriesLoading}
      data={repositories}
    >
      {(repositories) => (
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
          <LoaderButton isLoading={isLoading} type="submit" className="mt-5">
            Save
          </LoaderButton>
        </form>
      )}
    </DataView>
  );
};
export default IntegrateGithub;
