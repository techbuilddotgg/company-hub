import React from 'react';
import { Input, PageHeader, Question } from '@components';
import { Button } from '@components';
import { useRouter } from 'next/router';

const KnowledgeBase = () => {
  const router = useRouter();
  return (
    <div className={'flex flex-col gap-4'}>
      <PageHeader title={'Knowledge Base'} />
      <div className={'flex w-full flex-col gap-4'}>
        <Input placeholder={'Search...'} />
        <div className={'flex flex-row'}>
          <h2
            className={
              'text-2xl font-semibold text-gray-800 dark:text-gray-100'
            }
          >
            Top questions
          </h2>
          <Button
            onClick={() => {
              router.push('/knowledge-base/ask-question');
            }}
            className={'ml-auto'}
          >
            Ask a question
          </Button>
        </div>

        <Question
          votes={0}
          username={'domen'}
          title={'Ki mamo banane skrite?'}
          answers={0}
          createdAt={'2 min'}
        />

        <Question
          votes={0}
          username={'domen'}
          title={'Ki mamo banane skrite?'}
          answers={0}
          createdAt={'2 min'}
        />
      </div>
    </div>
  );
};

export default KnowledgeBase;
