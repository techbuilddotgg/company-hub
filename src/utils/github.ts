import { NextApiRequest } from 'next';
import crypto from 'crypto';
import { env } from '@env';

export const isSignatureValid = (req: NextApiRequest) => {
  const requestBody = JSON.stringify(req.body);

  // Calculate the HMAC hex digest
  const hmac = crypto.createHmac('sha256', env.GITHUB_WEBHOOK_SECRET);
  hmac.update(requestBody);
  const digest = hmac.digest('hex');

  const signatureHeader = `sha256=${digest}`;

  return signatureHeader === req.headers['x-hub-signature-256'];
};

export const getTaskTagFromFullBranchName = (branch: string) => {
  return branch.substring(branch.lastIndexOf('/') + 1, branch.length);
};
