import React from 'react';
import { Button, Dialog, DialogContent, DialogTrigger } from '@components';
import IntegrateGithub from '@components/pages/project/integrate-github';

interface GithubIntegrationDialogProps {
  boardId: string;
}
const GithubIntegrationDialog = ({ boardId }: GithubIntegrationDialogProps) => {
  const [dialogOpened, setDialogOpened] = React.useState(false);

  return (
    <Dialog open={dialogOpened}>
      <div className="flex flex-row justify-between">
        <DialogTrigger
          asChild
          onClick={() => {
            setDialogOpened(true);
          }}
        >
          <Button className="mt-4">Connect to Github</Button>
        </DialogTrigger>
      </div>

      <DialogContent setDialogOpen={setDialogOpened}>
        <IntegrateGithub boardId={boardId} />
      </DialogContent>
    </Dialog>
  );
};
export default GithubIntegrationDialog;
