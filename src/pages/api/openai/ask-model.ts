import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'langchain';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { HNSWLib } from 'langchain/vectorstores';
import { RetrievalQAChain } from 'langchain/chains';
import { z } from 'zod';
import { DirectoryLoader, TextLoader } from 'langchain/document_loaders';

const RequestBodySchema = z.object({ message: z.string().min(1) });
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

  const directoryPath = './public/uploads/fake-company-id';

  try {
    const loader = new DirectoryLoader(directoryPath, {
      '.txt': (path) => new TextLoader(path),
    });
    const docs = await loader.load();
    const vectorStore = await HNSWLib.fromDocuments(
      docs,
      new OpenAIEmbeddings(),
    );
    const model = new OpenAI({ temperature: 0.9 });
    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
    const chatResponse = await chain.call({
      query: body.message,
    });
    res.status(200).send({ chatResponse });
  } catch (e) {
    const err = e as Error;
    res.status(500).send({ error: err.message });
  }
}
