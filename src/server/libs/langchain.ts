import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { initializePineconeClient } from '@server/libs/pinecone';
import { env } from '@env';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { OpenAI } from 'langchain';
import { VectorDBQAChain } from 'langchain/chains';

export interface DocumentMetadata {
  authorId: string;
  companyId: string;
  documentId: string;
}

export const prepareDocument = async (
  document: Document[],
  metadata: DocumentMetadata,
) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 200,
  });

  const docOutput = await splitter.splitDocuments([
    new Document({
      pageContent: document?.[0]?.pageContent || '',
      metadata: metadata,
    }),
  ]);

  return docOutput;
};

export const loadDocument = async (filepath: string) => {
  const loader = new TextLoader(filepath);
  const doc = await loader.load();

  return doc;
};

export const initializeVectorDBQAChain = async (
  filter: Partial<DocumentMetadata>,
) => {
  const client = await initializePineconeClient();
  const pineconeIndex = client.Index(env.PINECONE_INDEX);
  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    {
      pineconeIndex,
      filter: filter,
    },
  );
  const model = new OpenAI({
    temperature: 0.9,
    maxTokens: -1,
    modelName: 'gpt-3.5-turbo',
  });
  return VectorDBQAChain.fromLLM(model, vectorStore, {
    k: 1,
    returnSourceDocuments: true,
  });
};

export const textToDocument = (
  text: string,
  metadata?: Partial<DocumentMetadata>,
) => {
  return new Document({
    pageContent: text,
    metadata: metadata,
  });
};
