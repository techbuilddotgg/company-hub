import { NextApiRequest, NextApiResponse } from 'next';
import { getTaskNameFromBranch, isSignatureValid } from '@utils/github';
import { prisma } from '@server/db/client';
import { ProjectBoardColumn } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (!isSignatureValid(req))
      return res.status(401).json({ message: 'Invalid signature' });

    const data = req.body;

    const branch = getTaskNameFromBranch(data.ref);

    const githubData = await prisma.githubData.findFirst({
      where: {
        repository: data.repository.name,
        owner: data.repository.owner.login,
      },
    });

    if (!githubData) return res.status(400).end();

    const githubWebhookAction = await prisma.githubWebhookAction.findUnique({
      where: {
        githubDataId_actionType: {
          githubDataId: githubData.id,
          actionType: 'CREATE',
        },
      },
    });

    const targetColumn = await prisma.$queryRaw<
      ProjectBoardColumn[]
    >`SELECT * FROM project_board_columns WHERE LOWER(name) = LOWER(${githubWebhookAction?.projectBoardColumnName}) AND projectBoardId = ${githubData?.projectBoardId} LIMIT 1`;

    const test = await prisma.projectBoardTask.findMany({
      where: {
        name: branch,
        projectBoardColumn: {
          projectBoard: { id: githubData?.projectBoardId },
        },
      },
    });
    console.log(test, targetColumn);
    const task = await prisma.projectBoardTask.updateMany({
      where: {
        name: branch,
        projectBoardColumn: {
          projectBoard: { id: githubData?.projectBoardId },
        },
      },
      data: {
        projectBoardColumnId: targetColumn[0]?.id,
      },
    });
    console.log(task);
  } catch (e) {
    console.log(e);
  }

  return res.status(200).end();
}
