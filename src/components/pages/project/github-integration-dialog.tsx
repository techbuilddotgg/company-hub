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
        <p>
          This functionality allows you to connect your agile board to a Github
          repository.
          <br /> Once you have established a connection, the application will
          automatically move tasks around the board. It works by first creating
          a task in the &ldquo;To do&rdquo; footer. Then you can copy the task
          label (you can find it next to the task name on the board and it is
          composed as &ldquo;project abbreviation-task sequence number&rdquo;)
          and create a branch with it. It is important that you name the branch
          &ldquo;.../task tag&rdquo; (example: if you have a task with the tag
          MP-1 you can name the branch &ldquo;feat/MP-1&rdquo;,
          &ldquo;alex/feat/MP-1&rdquo;...it is only important that the branch
          name ends with a &ldquo;/&rdquo; character followed by a task tag).
          When you branch, the task will automatically move to the
          &ldquo;Doing&rdquo; column. Also, the task will be moved to the
          &ldquo;Done&rdquo; column when you make a &ldquo;pull request&rdquo;
          of the branch. Of course, you can also change the columns to which the
          tasks will be moved
        </p>
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
