import {
  Button,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components';
import { trpc } from '@utils/trpc';
import { githubEventToText } from '@constants/github-event-to-text';

interface EditGithubConfigurationProps {
  boardId: string;
}
const EditGithubConfiguration = ({ boardId }: EditGithubConfigurationProps) => {
  const utils = trpc.useContext();
  const { mutate: deleteGithubIntegration } =
    trpc.github.removeWebhooks.useMutation();

  const { data: githubData } = trpc.github.getWebhookActions.useQuery({
    boardId,
  });
  const { data: projectBoardColumns } = trpc.board.getColumns.useQuery({
    boardId,
  });
  const { mutate: updateWebhookActionMutation } =
    trpc.github.updateWebhookAction.useMutation({
      onSuccess: () => {
        utils.github.getWebhookActions.invalidate({ boardId });
      },
    });

  return (
    <div>
      {githubData?.githubWebhooks.map((action) => (
        <div key={action.id}>
          <div>
            On {githubEventToText.get(action.actionType)} move task to{' '}
            <Select
              value={action.projectBoardColumnName}
              onValueChange={(value) =>
                updateWebhookActionMutation({
                  id: action.id,
                  projectBoardColumnName: value,
                })
              }
            >
              <SelectTrigger className="w-[180px]">
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
      <Button
        variant="destructive"
        onClick={() => deleteGithubIntegration({ boardId })}
      >
        Delete integration
      </Button>
    </div>
  );
};
export default EditGithubConfiguration;
