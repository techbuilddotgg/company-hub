import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import formidable, { Fields, Files } from 'formidable';
import { TextLoader } from 'langchain/document_loaders';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';
import { PineconeClient } from '@pinecone-database/pinecone';
import { env } from '@env';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { getAuth } from '@clerk/nextjs/server';

const RequestBodySchema = z.object({
  file: z.object({
    mimetype: z.string().min(1),
    filepath: z.string().min(1),
    newFilename: z.string().min(1),
    originalFilename: z.string().min(1),
  }),
});

type RequestBody = z.infer<typeof RequestBodySchema>;

export const config = {
  api: {
    bodyParser: false,
  },
};

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

  const formData: RequestBody = (await getFormData(
    req,
  )) as unknown as RequestBody;
  const isValid = RequestBodySchema.safeParse(formData);
  if (!isValid.success) {
    res.status(400).send({ error: isValid.error });
  }
  const loader = new TextLoader(formData.file.filepath);
  const doc = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 200,
  });

  const docOutput = await splitter.splitDocuments([
    new Document({
      pageContent: doc?.[0]?.pageContent || '',
      metadata: {
        companyId: 'fake-company-id',
      },
    }),
  ]);

  try {
    const client = new PineconeClient();
    await client.init({
      apiKey: env.PINECONE_API_KEY,
      environment: env.PINECONE_ENVIRONMENT,
    });
    const pineconeIndex = client.Index(env.PINECONE_INDEX);
    await PineconeStore.fromDocuments(docOutput, new OpenAIEmbeddings(), {
      pineconeIndex,
    });
    res.status(200).send({ message: 'Success' });
  } catch (e) {
    const err = e as Error;
    console.log(err);
    res.status(500).send({ error: err.message });
  }
}

async function getFormData(req: NextApiRequest) {
  const form = formidable({
    multiples: true,
    keepExtensions: true,
  });

  const formData = new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        reject("Couldn't parse form data");
      }
      resolve({ fields, files });
    });
  });
  const { fields, files } = (await formData) as {
    fields: Fields;
    files: Files;
  };
  return { ...fields, ...files };
}
