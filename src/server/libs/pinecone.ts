import { Document } from 'langchain/document';
import { PineconeClient } from '@pinecone-database/pinecone';
import { env } from '@env';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

export const initializePineconeClient = async () => {
  const client = new PineconeClient();
  await client.init({
    apiKey: env.PINECONE_API_KEY,
    environment: env.PINECONE_ENVIRONMENT,
  });
  return client;
};

export const uploadDocumentsToPinecone = async (documents: Document[]) => {
  const client = await initializePineconeClient();
  const pineconeIndex = client.Index(env.PINECONE_INDEX);
  await PineconeStore.fromDocuments(documents, new OpenAIEmbeddings(), {
    pineconeIndex,
  });
};
