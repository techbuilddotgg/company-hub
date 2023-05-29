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
import { RouterOutput, trpc } from '@utils/trpc';
import { githubEventToText } from '@constants/github-event-to-text';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';

type GithubDataType = RouterOutput['github']['getWebhookActions'];

interface EditGithubConfigurationProps {
  boardId: string;
  closeDialog: () => void;
}
const EditGithubConfiguration = ({
  boardId,
  closeDialog,
}: EditGithubConfigurationProps) => {
  const queryClient = useQueryClient();

  const { mutate: deleteGithubIntegration, isLoading: isDeleteLoading } =
    trpc.github.removeWebhooks.useMutation({
      onSuccess: () => {
        queryClient.invalidateQueries(
          getQueryKey(trpc.github.getWebhookActions),
        );
        queryClient.invalidateQueries(getQueryKey(trpc.github.isIntegrated));
        closeDialog();
      },
    });

  const { data: githubData, isLoading: isGithubDataLoading } =
    trpc.github.getWebhookActions.useQuery({
      boardId,
    });
  const { data: projectBoardColumns } = trpc.board.getColumns.useQuery({
    boardId,
  });
  const { mutate: updateWebhookActionMutation } =
    trpc.github.updateWebhookAction.useMutation({
      onSuccess: () => {
        queryClient.invalidateQueries(
          getQueryKey(trpc.github.getWebhookActions),
        );
      },
    });

  return (
    <div>
      <DataView<GithubDataType>
        isLoading={isGithubDataLoading}
        data={githubData}
      >
        {(githubData) => (
          <>
            {githubData.githubWebhooks.map((action) => (
              <div key={action.id} className="mt-4">
                <div>
                  <Label>
                    On {githubEventToText.get(action.actionType)} move task to{' '}
                  </Label>
                  <Select
                    value={action.projectBoardColumnName}
                    onValueChange={(value) =>
                      updateWebhookActionMutation({
                        id: action.id,
                        projectBoardColumnName: value,
                      })
                    }
                  >
                    <SelectTrigger className="mt-0.5 w-full">
                      <SelectValue placeholder="Repo" />
                    </SelectTrigger>
                    <SelectContent>
                      <ScrollArea className="h-[200px] w-[350px] rounded-md">
                        {projectBoardColumns?.map((column) => (
                          <SelectItem key={column.name} value={column.name}>
                            {column.name}
                          </SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
            <div className="mt-7 flex flex-row items-center justify-between">
              <LoaderButton
                variant="outline"
                isLoading={isDeleteLoading}
                onClick={() => deleteGithubIntegration({ boardId })}
              >
                Remove integration
              </LoaderButton>
              <Button onClick={closeDialog}>Update</Button>
            </div>
          </>
        )}
      </DataView>
    </div>
  );
};
export default EditGithubConfiguration;
