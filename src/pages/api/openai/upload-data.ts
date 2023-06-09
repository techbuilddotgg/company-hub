import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import formidable, { Fields, Files } from 'formidable';
import { clerkClient, getAuth } from '@clerk/nextjs/server';
import { prisma } from '@server/db/client';
import { uploadDocumentsToPinecone } from '@server/libs/pinecone';
import { loadDocument, prepareDocument } from '@server/libs/langchain';

const RequestBodySchema = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.status(405).send({ error: 'Allowed method is POST' });
  }

  const { userId } = await getAuth(req);

  if (!userId) {
    res.status(401).send({ error: 'Unauthorized' });
    return;
  }

  const user = await clerkClient.users.getUser(userId);

  const formData: RequestBody = (await getFormData(
    req,
  )) as unknown as RequestBody;

  const isValid = RequestBodySchema.safeParse(formData);
  if (!isValid.success) {
    res.status(400).send({ error: isValid.error });
  }
  const doc = await loadDocument(formData.file.filepath);

  const { id: docId } = await prisma.document.create({
    data: {
      authorId: user?.id as string,
      companyId: user?.publicMetadata.companyId as string,
      title: formData.title,
      description: formData.description,
      content: doc?.[0]?.pageContent as string,
    },
  });

  const docOutput = await prepareDocument(doc, {
    companyId: user?.publicMetadata.companyId as string,
    documentId: docId as string,
    authorId: user?.id as string,
  });

  try {
    await uploadDocumentsToPinecone(docOutput);
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
    maxFiles: 1,
    // 10 MB
    maxFileSize: 10 * 1024 * 1024,
    filter: (part) => {
      const allowedFileExtensions = ['txt', 'docx', 'md'];
      const fileType = part.originalFilename?.split('.').pop() || '';
      return allowedFileExtensions.includes(fileType);
    },
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
