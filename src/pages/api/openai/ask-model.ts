import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'langchain';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { VectorDBQAChain } from 'langchain/chains';
import { z } from 'zod';
import { PineconeClient } from '@pinecone-database/pinecone';
import { env } from '@env';
import { PineconeStore } from 'langchain/vectorstores/pinecone';

const RequestBodySchema = z.object({ prompt: z.string().min(1) });
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
