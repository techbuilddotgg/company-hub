import React, { FC } from 'react';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import { Card } from '@components/ui/card';
import { Markdown } from '@components/pages/knowledge-base/markdown';
import { Button } from '@components/ui/button';
import { useToast, useUpdateDocument } from '@hooks';
import { useForm } from 'react-hook-form';
import { useSaveDocument } from '@hooks';

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

  const { register, handleSubmit, watch, reset } = useForm<FormData>({
    defaultValues: initialValues,
  });

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

  const { mutate: handleSaveDocument } = useSaveDocument({
    onSuccess: () => {
      handleSuccess();
    },
  });

  const { mutate: handleUpdateDocument } = useUpdateDocument({
    onSuccess: () => {
      handleSuccess(refetch);
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
        placeholder="e.g. What is the naming convention for git branches?"
        {...register('description')}
      />

      <div className={'flex flex-col gap-4'}>
        <Textarea
          label={'Content'}
          info={
            'Describe all the information someone would need to answer your'
          }
          placeholder={'Write your knowledge here (it supports markdown)'}
          rows={20}
          {...register('content')}
        />
        <div>
          <label htmlFor={'content'} className={'font-semibold'}>
            Preview
          </label>
          <Card>
            <Markdown>{watch('content')}</Markdown>
          </Card>
        </div>
      </div>
      <Button type={'submit'} className={'w-fit'}>
        Save
      </Button>
    </form>
  );
};
