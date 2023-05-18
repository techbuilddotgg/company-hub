import React from 'react';
import { PageHeader, KnowledgeBaseSearch, LinkButton } from '@components';

const KnowledgeBase = () => {
  return (
    <div className={'flex h-full flex-col gap-2'}>
      <div className={'flex flex-row items-center'}>
        <PageHeader
          title={'Knowledge Base'}
          description={
            'Internal knowledge base and issue tracking system. It enables users ' +
            'to publish and search for internal problems and knowledge, fostering knowledge sharing and efficient problem resolution.'
          }
        />
        <LinkButton
          href={'/knowledge-base/add-knowledge'}
          className={'ml-auto'}
        >
          Add knowledge
        </LinkButton>
      </div>

      <div className={'flex w-full grow flex-col gap-4'}>
        <KnowledgeBaseSearch />

        <div className={'flex flex-row'}></div>
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
