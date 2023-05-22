import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { initializePineconeClient } from '@server/libs/pinecone';
import { env } from '@env';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { OpenAI } from 'langchain';
import { VectorDBQAChain } from 'langchain/chains';
import { DocxLoader, PDFLoader } from 'langchain/document_loaders';

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

  return await splitter.splitDocuments([
    new Document({
      pageContent: document?.[0]?.pageContent || '',
      metadata: metadata,
    }),
  ]);
};

export const loadDocument = async (filepath: string): Promise<Document[]> => {
  const fileExtension = filepath.split('.').pop();

  switch (fileExtension) {
    case 'md':
    case 'txt':
      const textLoader = new TextLoader(filepath);
      return await textLoader.load();
    case 'pdf':
      const pdfLoader = new PDFLoader(filepath);
      return await pdfLoader.load();
    case 'docx':
      const docxLoader = new DocxLoader(filepath);
      return await docxLoader.load();
    default:
      throw new Error('File type not supported.');
  }
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
