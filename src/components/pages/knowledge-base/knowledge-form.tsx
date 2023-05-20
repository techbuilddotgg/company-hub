import React, { FC } from 'react';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import { Card } from '@components/ui/card';
import { Markdown } from '@components/pages/knowledge-base/markdown';
import { LoaderButton } from '@components/ui/button';
import { useToast, useUpdateDocument } from '@hooks';
import { useForm } from 'react-hook-form';
import { useSaveDocument } from '@hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateDocumentValidator } from '@shared/validators/knowledge-base-validators';

interface FormData {
  title: string;
  content: string;
  description: string;
}

const initialState: FormData = {
  title: '',
  content: '',
  description: '',
};

export enum KnowledgeFormType {
  ADD = 'add',
  EDIT = 'edit',
}

interface KnowledgeFormProps {
  id?: string;
  initialValues?: FormData;
  type?: KnowledgeFormType;
  refetch?: () => void;
}

const toastMessage: Record<
  KnowledgeFormType,
  { title: string; description: string }
> = {
  [KnowledgeFormType.ADD]: {
    title: 'Knowledge added',
    description: 'Your knowledge has been added to the knowledge base',
  },
  [KnowledgeFormType.EDIT]: {
    title: 'Knowledge updated',
    description: 'Your knowledge has been updated',
  },
};

export const KnowledgeForm: FC<KnowledgeFormProps> = ({
  id,
  refetch,
  initialValues = initialState,
  type = KnowledgeFormType.ADD,
}) => {
  const { toast } = useToast();

  const { register, handleSubmit, watch, formState, reset } = useForm<FormData>(
    {
      resolver: zodResolver(CreateDocumentValidator),
      defaultValues: initialValues,
    },
  );

  const { errors } = formState;

  const handleSuccess = (cb?: () => void) => {
    toast({
      title: toastMessage[type].title,
      description: toastMessage[type].description,
    });

    if (cb) {
      cb();
    } else {
      reset();
    }
  };

  const { mutate: handleSaveDocument, isLoading: isSaving } = useSaveDocument({
    onSuccess: () => {
      handleSuccess();
    },
    onError: (error) => {
      console.log(error.shape?.data.zodError);
      toast({
        title: 'Document save failed',
        description: `The document could not be saved.`,
      });
    },
  });

  const { mutate: handleUpdateDocument, isLoading: isUpdating } =
    useUpdateDocument({
      onSuccess: () => {
        handleSuccess(refetch);
      },
      onError: () => {
        toast({
          title: 'Document update failed',
          description: `The document could not be updated.`,
        });
      },
    });

  const onSubmit = (data: FormData) => {
    if (type === KnowledgeFormType.ADD) {
      handleSaveDocument(data);
    } else {
      handleUpdateDocument({ ...data, id: id as string });
    }
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

      <div className={'flex flex-col gap-4'}>
        <Textarea
          label={'Content'}
          error={errors.content}
          info={
            'Describe all the information someone would need to answer your'
          }
          placeholder={'Write your knowledge here (it supports markdown)'}
          rows={20}
          {...register('content')}
        />
        {watch('content') && (
          <div>
            <label htmlFor={'content'} className={'font-semibold'}>
              Preview
            </label>
            <Card>
              <Markdown>{watch('content')}</Markdown>
            </Card>
          </div>
        )}
      </div>
      <LoaderButton
        isLoading={isSaving || isUpdating}
        type={'submit'}
        className={'w-fit'}
      >
        Save
      </LoaderButton>
    </form>
  );
};
