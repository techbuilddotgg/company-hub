import React, { FC } from 'react';
import { Markdown } from '@components';
import Image from 'next/image';
import PageSubheader from '@components/ui/page-subheader';

interface Props {
  isLoading: boolean;
  data?: { response: string };
}

export const AiResponse: FC<Props> = ({ isLoading, data }) => {
  return (
    <div className={'flex flex-col gap-4'}>
      <PageSubheader
        title={'AI response'}
        description={
          'This is a response from OpenAI based on your uploaded documents.'
        }
      />
      {isLoading && (
        <div className={'flex flex-col items-center'}>
          <Image
            src={'/assets/robot.gif'}
            width={600}
            height={300}
            alt={'loading'}
          />
          <p className={'font-semibold text-gray-400'}>
            Please wait while I&apos;m searching for results ...
          </p>
        </div>
      )}
      {!isLoading && data && <Markdown>{data.response}</Markdown>}
    </div>
  );
};
