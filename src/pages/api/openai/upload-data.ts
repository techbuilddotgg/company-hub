import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import formidable, { Fields, Files } from 'formidable';
import * as fs from 'fs';

const RequestBodySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
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

  const formData: RequestBody = (await getFormData(
    req,
  )) as unknown as RequestBody;
  const isValid = RequestBodySchema.safeParse(formData);
  if (!isValid.success) {
    res.status(400).send({ error: isValid.error });
  }

  const companyId = 'fake-company-id';
  const companyDir = `./public/uploads/${companyId}`;
  if (!fs.existsSync(companyDir)) {
    fs.mkdirSync(companyDir);
  }
  try {
    await saveFile({
      path: formData.file.filepath,
      location: `${companyDir}/${formData.file.originalFilename}`,
    });
  } catch (e) {
    const err = e as Error;
    res.status(500).send({ error: err.message });
    return;
  }

  res.status(200).send({ message: 'Success' });
}

async function getFormData(req: NextApiRequest) {
  const form = formidable({ multiples: true });

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

async function saveFile({
  path,
  location,
}: {
  path: string;
  location: string;
}) {
  const data = fs.readFileSync(path);
  fs.writeFileSync(location, data);
  await fs.unlinkSync(path);
  return;
}
