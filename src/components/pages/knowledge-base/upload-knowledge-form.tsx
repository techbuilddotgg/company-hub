import React from 'react';
import { Button, Input } from '@components';

export const UploadKnowledgeForm = () => {
  return (
    <form className={'flex flex-col gap-4'}>
      <Input
        label={'File with knowledge'}
        info={'Supported file extensions are .docx, .pdf, .txt, .md'}
        type={'file'}
      />
      <Button type={'submit'} className={'w-fit'}>
        Save
      </Button>
    </form>
  );
};
