import React from 'react';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import { Card } from '@components/ui/card';
import { Markdown } from '@components/pages/knowledge-base/markdown';
import { Button } from '@components/ui/button';
import { useToast } from '@hooks';
import { useForm } from 'react-hook-form';

interface FormData {
  title: string;
  description: string;
}

const initialState: FormData = {
  title: '',
  description: '',
};

export const AskQuestionForm = () => {
  const { toast } = useToast();

  const { register, handleSubmit, watch } = useForm<FormData>({
    defaultValues: initialState,
  });
  console.log(watch('description'));

  const onSubmit = (data: FormData) => {
    toast({
      title: 'Question submitted.',
      description: 'Your question has been added to Knowledge Base.',
    });
  };

  return (
    <form className={'flex flex-col gap-4'} onSubmit={handleSubmit(onSubmit)}>
      <div className={'flex flex-col'}>
        <label htmlFor={'title'} className={'font-semibold'}>
          Title
        </label>
        <span className={'text-sm text-gray-500'}>
          Be specific and imagine you’re asking a question to another person.
        </span>
        <Input
          placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
          {...register('title')}
        />
      </div>

      <div className={'flex flex-col'}>
        <label htmlFor={'description'} className={'font-semibold'}>
          What are the details of your problem?
        </label>
        <span className={'text-sm text-gray-500'}>
          Introduce the problem and expand on what you put in the title. Minimum
          20 characters.
        </span>
      </div>
      <div className={'grid grid-cols-2 gap-4'}>
        <Textarea
          placeholder={'Description'}
          rows={20}
          {...register('description')}
        />

        <Card>
          <Markdown>{watch('description')}</Markdown>
        </Card>
      </div>

      <div className={'flex flex-col'}>
        <label htmlFor={'tags'} className={'font-semibold'}>
          Tags
        </label>
        <span className={'text-sm text-gray-500'}>
          Add up to 5 tags to describe what your question is about. Start typing
          to see suggestions.
        </span>
        <Input placeholder="#r #dataframe #dplyr" {...register('title')} />
      </div>
      <Button type={'submit'} className={'w-fit'}>
        Submit
      </Button>
    </form>
  );
};
