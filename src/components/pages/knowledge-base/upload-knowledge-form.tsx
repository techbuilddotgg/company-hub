import React from 'react';
import {
  Input,
  LoaderButton,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@components';
import { useForm } from 'react-hook-form';
import { useToast, useUploadDocument } from '@hooks';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info } from 'lucide-react';
import { useRouter } from 'next/router';
import { AppRoute } from '@constants/app-routes';

export interface UploadFormData {
  fileList: FileList;
  title: string;
  description: string;
}

const UploadFormSchema = z.object({
  fileList: z.any().refine((val) => val.length > 0, "File can't be empty"),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
});

const UploadTooltip = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger type={'button'}>
          <Info className={'h-4 w-4 text-blue-600'} />
        </TooltipTrigger>
        <TooltipContent>
          <p>
            For best user experience we recommend using files with{' '}
            <span className={'font-semibold'}>markdown</span> content.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const UploadKnowledgeForm = () => {
  const { register, handleSubmit, reset, formState } = useForm<UploadFormData>({
    resolver: zodResolver(UploadFormSchema),
  });
  const { toast } = useToast();

  const { errors } = formState;
  const router = useRouter();

  const { mutateAsync, isLoading } = useUploadDocument({
    onSuccess: async () => {
      toast({
        title: 'Document uploaded',
        description: 'Document has been uploaded successfully.',
      });
      reset();
      await router.push(AppRoute.ADD_KNOWLEDGE);
    },
    onError: () => {
      toast({
        variant: 'destructive',
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
        error={errors.title}
        info={
          'Knowledge Base works best with a single question that can be answered'
        }
        placeholder="e.g. What is the naming convention for git branches?"
        {...register('title')}
      />

      <Input
        label={'Description'}
        error={errors.description}
        info={
          'A short description of the knowledge. This will be shown in the search results.'
        }
        placeholder="e.g. Branch naming conventions"
        {...register('description')}
      />
      <Input
        label={'File with knowledge'}
        error={errors.fileList}
        tooltip={<UploadTooltip />}
        info={'Supported file extensions are: .txt, .docx, .md'}
        type={'file'}
        accept={'.txt,.pdf,.docx,.md'}
        {...register('fileList')}
      />
      <LoaderButton isLoading={isLoading} type={'submit'} className={'w-fit'}>
        Save
      </LoaderButton>
    </form>
  );
};
