import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { getAuth } from '@clerk/nextjs/server';
import { initializeVectorDBQAChain } from '@server/libs/langchain';

const RequestBodySchema = z.object({
  prompt: z.string().min(3),
});
type RequestBody = z.infer<typeof RequestBodySchema>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.status(405).send({ error: 'Allowed method is POST' });
  }

  const isValid = RequestBodySchema.safeParse(req.body);
  const body: RequestBody = req.body;

  if (!isValid.success) {
    res.status(400).send({ error: isValid.error });
    return;
  }

  const user = await getAuth(req);

  if (!user) {
    res.status(401).send({ error: 'Unauthorized' });
    return;
  }

  try {
    const chain = await initializeVectorDBQAChain({
      companyId: user.user?.publicMetadata.compant as string,
    });
    const chatResponse = await chain.call({
      query: body.prompt,
    });
    res.status(200).send({ response: chatResponse.text });
  } catch (e) {
    const err = e as Error;
    res.status(500).send({ error: err.message });
  }
}
