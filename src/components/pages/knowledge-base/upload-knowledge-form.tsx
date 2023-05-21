import React from 'react';
import { Input, LoaderButton } from '@components';
import { useForm } from 'react-hook-form';
import { useToast, useUploadDocument } from '@hooks';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export interface UploadFormData {
  fileList: FileList;
  title: string;
  description: string;
}

const UploadFormSchema = z.object({
  fileList: z.any().refine((val) => val.length > 0),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
});

export const UploadKnowledgeForm = () => {
  const { register, handleSubmit, reset } = useForm<UploadFormData>({
    resolver: zodResolver(UploadFormSchema),
  });
  const { toast } = useToast();

  const { mutateAsync, isLoading } = useUploadDocument({
    onSuccess: () => {
      toast({
        title: 'Document uploaded',
        description: 'Document has been uploaded successfully.',
      });
      reset();
    },
    onError: () => {
      toast({
        title: 'Document upload failed',
        description: `Could not upload document.`,
      });
    },
  });

  const onSubmit = async (data: UploadFormData) => {
    await mutateAsync(data);
  };

  return (
    <form className={'flex flex-col gap-4'} onSubmit={handleSubmit(onSubmit)}>
      <Input
        label={'Title'}
        info={
          'Knowledge Base works best with a single question that can be answered'
        }
        placeholder="e.g. What is the naming convention for git branches?"
        {...register('title')}
      />

      <Input
        label={'Description'}
        info={
          'A short description of the knowledge. This will be shown in the search results.'
        }
        placeholder="e.g. Branch naming conventions"
        {...register('description')}
      />
      <Input
        label={'File with knowledge'}
        info={'Supported file extensions are: .txt'}
        type={'file'}
        accept={'.txt'}
        {...register('fileList')}
      />
      <LoaderButton isLoading={isLoading} type={'submit'} className={'w-fit'}>
        Save
      </LoaderButton>
    </form>
  );
};
