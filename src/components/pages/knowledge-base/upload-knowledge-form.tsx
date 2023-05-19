import React from 'react';
import { Button, Input } from '@components';
import { useForm } from 'react-hook-form';
import { useUploadDocument } from '@hooks';

export const UploadKnowledgeForm = () => {
  const { register, handleSubmit } = useForm<{ fileList: FileList }>({});

  const { mutateAsync } = useUploadDocument();
  const onSubmit = async (data: { fileList: FileList }) => {
    const file = data.fileList[0];
    if (!file) return;
    await mutateAsync(file);
  };

  return (
    <form className={'flex flex-col gap-4'} onSubmit={handleSubmit(onSubmit)}>
      <Input
        label={'File with knowledge'}
        info={'Supported file extensions are .docx, .pdf, .txt, .md'}
        type={'file'}
        {...register('fileList')}
      />
      <Button type={'submit'} className={'w-fit'}>
        Save
      </Button>
    </form>
  );
};
