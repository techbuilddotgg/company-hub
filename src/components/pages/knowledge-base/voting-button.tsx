import React, { FC } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const VotingButton: FC<{ counter: number }> = ({ counter }) => {
  return (
    <div className={'flex flex-col items-center'}>
      <ChevronUp />
      {counter}
      <ChevronDown />
    </div>
  );
};
