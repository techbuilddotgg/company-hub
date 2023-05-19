import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'langchain';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { VectorDBQAChain } from 'langchain/chains';
import { z } from 'zod';
import { PineconeClient } from '@pinecone-database/pinecone';
import { env } from '@env';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { getAuth } from '@clerk/nextjs/server';

const RequestBodySchema = z.object({
  prompt: z.string().min(1),
});
type RequestBody = z.infer<typeof RequestBodySchema>;

// Create a new ratelimiter, that allows 10 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true,
});

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

  const user = getAuth(req);

  if (!user.userId) {
    res.status(401).send({ error: 'Unauthorized' });
    return;
  }

  const { success } = await ratelimit.limit(user.userId);
  if (!success) {
    res.status(429).send({ error: 'Rate limit exceeded' });
    return;
  }

  try {
    const client = new PineconeClient();
    await client.init({
      apiKey: env.PINECONE_API_KEY,
      environment: env.PINECONE_ENVIRONMENT,
    });
    const pineconeIndex = client.Index(env.PINECONE_INDEX);
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      { pineconeIndex },
    );

    const model = new OpenAI({ temperature: 0.9 });
    const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
      k: 1,
      returnSourceDocuments: true,
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
