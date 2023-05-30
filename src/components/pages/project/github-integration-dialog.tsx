import React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components';
import IntegrateGithub from '@components/pages/project/integrate-github';
import { trpc } from '@utils/trpc';
import EditGithubConfiguration from '@components/pages/project/edit-github-configuration';

interface GithubIntegrationDialogProps {
  boardId: string;
}
const GithubIntegrationDialog = ({ boardId }: GithubIntegrationDialogProps) => {
  const [dialogOpened, setDialogOpened] = React.useState(false);
  const { data: githubIntegrated } = trpc.github.isIntegrated.useQuery({
    boardId,
  });

  return (
    <Dialog open={dialogOpened}>
      <div className="flex flex-row justify-between">
        <DialogTrigger
          asChild
          onClick={() => {
            setDialogOpened(true);
          }}
        >
          <Button variant={githubIntegrated ? 'outline' : 'default'}>
            {githubIntegrated ? 'Github configuration' : 'Connect to Github'}
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent setDialogOpen={setDialogOpened}>
        <DialogHeader>
          <DialogTitle>Edit configuration</DialogTitle>
        </DialogHeader>
        {githubIntegrated ? (
          <EditGithubConfiguration
            boardId={boardId}
            closeDialog={() => setDialogOpened(false)}
          />
        ) : (
          <IntegrateGithub
            boardId={boardId}
            closeDialog={() => setDialogOpened(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
export default GithubIntegrationDialog;
