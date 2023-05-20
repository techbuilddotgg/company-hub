import { NextApiRequest, NextApiResponse } from 'next';
import { getTaskNameFromBranch, isSignatureValid } from '@utils/github';
import { prisma } from '@server/db/client';

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

    const doingColumn = await prisma.projectBoardColumn.findFirst({
      where: {
        OR: [{ name: 'Doing' }, { name: 'doing' }],
      },
    });

    const task = await prisma.projectBoardTask.updateMany({
      where: {
        name: branch,
        projectBoardColumn: {
          projectBoard: { id: githubData?.projectBoardId },
        },
      },
      data: {
        projectBoardColumnId: doingColumn?.id,
      },
    });
    console.log(task);
  } catch (e) {
    console.log(e);
  }

  return res.status(200).end();
}
