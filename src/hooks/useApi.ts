import { trpc, RouterInput } from '@utils/trpc';

export const useGetDocuments = (
  input?: RouterInput['knowledgeBase']['findDocuments'],
  opts?: any,
) => {
  return trpc.knowledgeBase.findDocuments.useQuery(input, opts);
};

export const useGetDocument = (
  input: RouterInput['knowledgeBase']['findById'],
) => {
  return trpc.knowledgeBase.findById.useQuery(input);
};
