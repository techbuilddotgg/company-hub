import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@server/db/client';
import { getTaskTagFromFullBranchName, isSignatureValid } from '@utils/github';
import { ProjectBoardColumn } from '@prisma/client';
import pusher from '@utils/pusher';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (!isSignatureValid(req))
      return res.status(401).json({ message: 'Invalid signature' });

    const data = req.body;

    if (data.action === 'closed') {
      const taskTag = getTaskTagFromFullBranchName(data.pull_request.head.ref);

      const githubData = await prisma.githubData.findMany({
        where: {
          repository: data.repository.name,
          owner: data.repository.owner.login,
        },
      });

      if (!githubData || githubData.length === 0) return res.status(400).end();

      for (const data of githubData) {
        const githubWebhookAction = await prisma.githubWebhookAction.findUnique(
          {
            where: {
              githubDataId_actionType: {
                githubDataId: data.id,
                actionType: 'PULL_REQUEST',
              },
            },
          },
        );

        const targetColumn = await prisma.$queryRaw<
          ProjectBoardColumn[]
        >`SELECT * FROM project_board_columns WHERE LOWER(name) = LOWER(${githubWebhookAction?.projectBoardColumnName}) AND projectBoardId = ${data?.projectBoardId} LIMIT 1`;

        const test = await prisma.projectBoardTask.findMany({
          where: {
            tag: taskTag,
            projectBoardColumn: {
              projectBoard: { id: data?.projectBoardId },
            },
          },
        });
        console.log(taskTag, test, targetColumn, data);
        const task = await prisma.projectBoardTask.updateMany({
          where: {
            tag: taskTag,
            projectBoardColumn: {
              projectBoard: { id: data?.projectBoardId },
            },
          },
          data: {
            projectBoardColumnId: targetColumn[0]?.id,
          },
        });

        pusher.trigger('board-channel', 'refetch-event', {});
        console.log(task);
      }
    }
  } catch (e) {
    console.log(e);
  }

  return res.status(200).end();
}
