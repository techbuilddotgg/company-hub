import { trpc, type RouterInput, type ReactQueryOptions } from '@utils/trpc';

// Knowledge Base
export const useGetDocuments = (
  input?: RouterInput['knowledgeBase']['findDocuments'],
  opts?: ReactQueryOptions['knowledgeBase']['findDocuments'],
) => {
  return trpc.knowledgeBase.findDocuments.useQuery(input, opts);
};

export const useGetDocument = (
  input: RouterInput['knowledgeBase']['findById'],
  opts?: ReactQueryOptions['knowledgeBase']['findById'],
) => {
  return trpc.knowledgeBase.findById.useQuery(input, opts);
};

export const useSaveDocument = (
  opts?: ReactQueryOptions['knowledgeBase']['saveDocument'],
) => {
  return trpc.knowledgeBase.saveDocument.useMutation(opts);
};

export const useDeleteDocument = (
  opts?: ReactQueryOptions['knowledgeBase']['deleteDocument'],
) => {
  return trpc.knowledgeBase.deleteDocument.useMutation(opts);
};

export const useUpdateDocument = (
  opts?: ReactQueryOptions['knowledgeBase']['updateDocument'],
) => {
  return trpc.knowledgeBase.updateDocument.useMutation(opts);
};
