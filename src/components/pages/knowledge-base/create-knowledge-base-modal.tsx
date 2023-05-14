import React, { FC } from 'react';
import { Button, DialogButton, Input, Textarea } from '@components';
import { useForm } from 'react-hook-form';


interface FormData {
  name: string;
  description: string;
}

const CreateKnowledgeBaseForm: FC = () => {
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form className={'flex flex-col gap-4'} onSubmit={handleSubmit(onSubmit)}>
      <Input label={'Name'} {...register('name')} />
      <Textarea label={'Description'} {...register('description')} rows={5} />

      <Button className={'ml-auto'} type={'submit'}>
        Save
      </Button>
    </form>
  );
};

export const CreateKnowledgeBaseModal = () => {
  return (
    <DialogButton
      title={'Create knowledge base model'}
      description={'Lorem ipsum'}
      buttonText={'Create model'}
      actionText={'Save'}
      content={<CreateKnowledgeBaseForm />}
    />
  );
};
