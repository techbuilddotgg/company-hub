import React from 'react';
import { Button, Input, PageHeader } from '@components';
import { CreateKnowledgeBaseModal } from '@components/pages/knowledge-base/create-knowledge-base-modal';
import { useMutation } from '@tanstack/react-query';

const KnowledgeBase = () => {
  const { mutate } = useMutation({
    mutationFn: () => {
      return fetch('/api/openai/ask-model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Tell me something about Domen Perko',
        }),
      });
    },
  });

  return (
    <div className={'flex h-full flex-col gap-2'}>
      <PageHeader title={'Knowledge Base'} />
      <div className={'flex w-full grow flex-col gap-4'}>
        <Input placeholder={'Search...'} />
        <Button onClick={() => mutate()}>Ask</Button>
        <div className={'flex flex-row'}>
          <h2
            className={
              'text-2xl font-semibold text-gray-800 dark:text-gray-100'
            }
          >
            Models
          </h2>
          <div className={'ml-auto'}>
            <CreateKnowledgeBaseModal />
          </div>
        </div>
        <div className={'grid grid-cols-4 gap-4'}></div>
      </div>

      {/*<div className={'flex flex-row justify-center gap-1'}>*/}
      {/*  <LinkButton href={'/knowledge-base?age=1'} variant={'ghost'}>*/}
      {/*    <ChevronLeft />*/}
      {/*  </LinkButton>*/}
      {/*  <div className={'flex flex-row gap-2'}>*/}
      {/*    <LinkButton href={'/knowledge-base?age=1'}>1</LinkButton>*/}
      {/*    <LinkButton href={'/knowledge-base?age=2'}>2</LinkButton>*/}
      {/*    <LinkButton href={'/knowledge-base?age=3'}>3</LinkButton>*/}
      {/*  </div>*/}

      {/*  <LinkButton href={'/knowledge-base?age=1'} variant={'ghost'}>*/}
      {/*    <ChevronRight />*/}
      {/*  </LinkButton>*/}
      {/*</div>*/}
    </div>
  );
};

export default KnowledgeBase;
