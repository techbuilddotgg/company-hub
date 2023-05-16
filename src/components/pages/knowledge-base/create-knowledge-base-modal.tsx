import React, { FC } from 'react';
import { Button, DialogButton, Input, Textarea } from '@components';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

interface CreateModelData {
  name: string;
  description: string;
  file?: FileList;
}

const CreateKnowledgeBaseForm: FC = () => {
  const { register, handleSubmit } = useForm<CreateModelData>({
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: (data: CreateModelData) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('file', data.file?.[0] as File);

      return fetch('/api/openai/upload-data', {
        method: 'POST',
        body: formData,
      });
    },
  });

  const onSubmit = async (data: CreateModelData) => {
    await mutateAsync(data);
  };

  return (
    <form className={'flex flex-col gap-4'} onSubmit={handleSubmit(onSubmit)}>
      <Input label={'Name'} {...register('name')} />
      <Textarea label={'Description'} {...register('description')} rows={5} />
      <Input label={'File URL'} type={'file'} {...register('file')} />
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
