import React from 'react';
import { Input, LinkButton, PageHeader, Question } from '@components';
import { useRouter } from 'next/router';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const KnowledgeBase = () => {
  const router = useRouter();
  return (
    <div className={'flex h-full flex-col'}>
      <PageHeader title={'Knowledge Base'} />
      <div className={'flex w-full grow flex-col gap-4'}>
        <Input placeholder={'Search...'} />
        <div className={'flex flex-row'}>
          <h2
            className={
              'text-2xl font-semibold text-gray-800 dark:text-gray-100'
            }
          >
            Top questions
          </h2>
          <LinkButton
            href={'/knowledge-base/ask-question'}
            className={'ml-auto'}
          >
            Ask a question
          </LinkButton>
        </div>

        <Question
          votes={23}
          username={'domen'}
          title={'Ki mamo banane skrite?'}
          answers={2}
          createdAt={'2 min'}
        />

        <Question
          votes={0}
          username={'domen'}
          title={'Bomo naredli letnik?'}
          answers={0}
          createdAt={'2 min'}
        />

        <Question
          votes={0}
          username={'domen'}
          title={'Gremo potem v Kozlovno na pir?'}
          answers={3}
          createdAt={'2 min'}
        />
        <Question
          votes={1}
          username={'domen'}
          title={'Kam gremo pol jest?'}
          answers={1}
          createdAt={'2 min'}
        />
      </div>
      <div className={'flex flex-row justify-center gap-1'}>
        <LinkButton href={'/knowledge-base?age=1'} variant={'ghost'}>
          <ChevronLeft />
        </LinkButton>
        <div className={'flex flex-row gap-2'}>
          <LinkButton href={'/knowledge-base?age=1'}>1</LinkButton>
          <LinkButton href={'/knowledge-base?age=2'}>2</LinkButton>
          <LinkButton href={'/knowledge-base?age=3'}>3</LinkButton>
        </div>

        <LinkButton href={'/knowledge-base?age=1'} variant={'ghost'}>
          <ChevronRight />
        </LinkButton>
      </div>
    </div>
  );
};

export default KnowledgeBase;
