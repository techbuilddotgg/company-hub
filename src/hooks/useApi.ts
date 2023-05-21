import { type ReactQueryOptions, type RouterInput, trpc } from '@utils/trpc';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { UploadFormData } from '@components';

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

export const useUploadDocument = (
  opts?: UseMutationOptions<
    { message: string },
    Error,
    UploadFormData,
    unknown
  >,
) => {
  return useMutation({
    ...opts,
    mutationFn: async ({ fileList, title, description }) => {
      const file = fileList[0];
      if (!file) throw new Error('No file provided');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description);

      const res = await fetch('/api/openai/upload-data', {
        method: 'POST',
        body: formData,
      });
      return await res.json();
    },
  });
};

export const useOpenAI = (
  opts?: UseMutationOptions<
    { response: string },
    Error,
    { prompt: string },
    unknown
  >,
) => {
  return useMutation({
    ...opts,
    mutationFn: async ({ prompt }) => {
      const res = await fetch('/api/openai/ask-model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      return await res.json();
    },
  });
};
