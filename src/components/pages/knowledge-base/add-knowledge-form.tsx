import React from 'react';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import { Card } from '@components/ui/card';
import { Markdown } from '@components/pages/knowledge-base/markdown';
import { Button } from '@components/ui/button';
import { useToast } from '@hooks';
import { useForm } from 'react-hook-form';
import { trpc } from '@utils/trpc';

interface FormData {
  title: string;
  content: string;
}

const initialState: FormData = {
  title: '',
  content: '',
};

export const AddKnowledgeForm = () => {
  const { toast } = useToast();

  const { register, handleSubmit, watch } = useForm<FormData>({
    defaultValues: initialState,
  });

  const { mutateAsync } = trpc.knowledgeBase.saveDocument.useMutation();

  const onSubmit = (data: FormData) => {
    mutateAsync(data);
  };

  return (
    <form className={'flex flex-col gap-4'} onSubmit={handleSubmit(onSubmit)}>
      <div className={'flex flex-col'}>
        <label htmlFor={'title'} className={'font-semibold'}>
          Title
        </label>
        <span className={'text-sm text-gray-500'}>
          Knowledge Base works best with a single question that can be answered
        </span>
        <Input
          placeholder="e.g. What is the naming convention for git branches?"
          {...register('title')}
        />
      </div>

      <div className={'flex flex-col'}>
        <label htmlFor={'description'} className={'font-semibold'}>
          What are the details?
        </label>
        <span className={'text-sm text-gray-500'}>
          Describe all the information someone would need to answer your
        </span>
      </div>
      <div className={'grid grid-cols-2 gap-4'}>
        <Textarea
          placeholder={'Description'}
          rows={20}
          {...register('content')}
        />

        <Card>
          <Markdown>{watch('content')}</Markdown>
        </Card>
      </div>

      {/*<div className={'flex flex-col'}>*/}
      {/*  <label htmlFor={'tags'} className={'font-semibold'}>*/}
      {/*    Tags*/}
      {/*  </label>*/}
      {/*  <span className={'text-sm text-gray-500'}>*/}
      {/*    Add up to 5 tags to describe what your question is about. Start typing*/}
      {/*    to see suggestions.*/}
      {/*  </span>*/}
      {/*  <Input placeholder="#r #dataframe #dplyr" {...register('title')} />*/}
      {/*</div>*/}
      <Button type={'submit'} className={'w-fit'}>
        Save
      </Button>
    </form>
  );
};
