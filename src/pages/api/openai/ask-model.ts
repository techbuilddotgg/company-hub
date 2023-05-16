import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'langchain';
import * as fs from 'fs';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { HNSWLib } from 'langchain/vectorstores';
import { RetrievalQAChain } from 'langchain/chains';
import { z } from 'zod';

const RequestBodySchema = z.object({ message: z.string().min(1) });
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.status(405).send({ error: 'Allowed method is POST' });
  }

  const isValid = RequestBodySchema.safeParse(req.body);

  if (!isValid.success) {
    res.status(400).send({ error: isValid.error });
  }

  try {
    const model = new OpenAI({ temperature: 0.9 });
    const text = fs.readFileSync('test.txt', 'utf8');
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });
    const docs = await textSplitter.createDocuments([text]);

    const vectorStore = await HNSWLib.fromDocuments(
      docs,
      new OpenAIEmbeddings(),
    );

    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
    const chatResponse = await chain.call({
      query: 'Who is Domen Perko?',
    });

    res.status(200).send({ chatResponse });
  } catch (e) {
    const err = e as Error;
    res.status(500).send({ error: err.message });
  }
}
