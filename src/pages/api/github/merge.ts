import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@server/db/client';
import { getTaskNameFromBranch, isSignatureValid } from '@utils/github';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (!isSignatureValid(req))
      return res.status(401).json({ message: 'Invalid signature' });

    const data = req.body;

    if (data.action === 'closed') {
      const taskName = getTaskNameFromBranch(data.pull_request.head.ref);

      const githubData = await prisma.githubData.findFirst({
        where: {
          repository: data.repository.name,
          owner: data.repository.owner.login,
        },
      });

      const doneColumn = await prisma.projectBoardColumn.findFirst({
        where: {
          OR: [{ name: 'Done' }, { name: 'done' }],
        },
      });

      const task = await prisma.projectBoardTask.updateMany({
        where: {
          name: taskName,
          projectBoardColumn: {
            projectBoard: { id: githubData?.projectBoardId },
          },
        },
        data: {
          projectBoardColumnId: doneColumn?.id,
        },
      });
      console.log(task);
    }
  } catch (e) {
    console.log(e);
  }

  return res.status(200).end();
}
