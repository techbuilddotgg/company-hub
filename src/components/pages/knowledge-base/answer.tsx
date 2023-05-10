import React, { FC } from 'react';
import { VotingButton } from '@components/pages/knowledge-base/voting-button';
import { Check } from 'lucide-react';
import colors from 'tailwindcss/colors';

interface AnswerProps {
  text: string;
  votes: number;
  username: string;
  isCorrect?: boolean;
}

export const Answer: FC<AnswerProps> = ({
  text,
  votes,
  username,
  isCorrect,
}) => {
  return (
    <div className={'flex flex-row items-center gap-4 border-b'}>
      <VotingButton counter={Math.floor(Math.random() * 100)} />
      <div className={'grow'}>
        <p>{text}</p>
        <p>
          Answered by <span className={'font-semibold'}>{username}</span> 2 min
          ago
        </p>
      </div>
      {isCorrect && <Check color={colors.green['500']} size={36} />}
    </div>
  );
};
