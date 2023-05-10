import React, { FC } from 'react';
import { Card } from '@components';
import Link from 'next/link';

interface QuestionProps {
  title: string;
  votes: number;
  answers: number;
  username: string;
  createdAt: string;
}

export const Question: FC<QuestionProps> = ({
  title,
  votes,
  answers,
  username,
  createdAt,
}) => {
  return (
    <Card className={'flex flex-row justify-between'}>
      <div className={'flex flex-col gap-1'}>
        <Link href={'/knowledge-base/question/1'}>
          <h3
            className={
              'cursor-pointer text-lg font-semibold text-gray-800 dark:text-gray-100'
            }
          >
            {title}
          </h3>
        </Link>
        <p>
          <span className={'font-semibold'}>{username}</span> posted {createdAt}{' '}
          ago
        </p>
      </div>
      <div className={'flex flex-col gap-1 text-right'}>
        <div>votes: {votes}</div>
        <div>answers: {answers}</div>
      </div>
    </Card>
  );
};
