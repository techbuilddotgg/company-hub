import React, { useState } from 'react';
import {
  DocumentFeed,
  KnowledgeBaseSearch,
  LinkButton,
  Markdown,
  PageHeader,
  SearchOption,
} from '@components';
import { AppRoute } from '@constants/app-routes';
import { useForm } from 'react-hook-form';
import { useDebounce, useGetDocuments, useOpenAI } from '@hooks';
import Image from 'next/image';

const KnowledgeBase = () => {
  const { register, watch } = useForm<{
    manualSearch: string;
    aiSearch: string;
  }>({
    defaultValues: {
      manualSearch: '',
      aiSearch: '',
    },
  });

  const manualSearch = useDebounce(watch('manualSearch'));
  const aiSearch = useDebounce(watch('aiSearch'));

  const { data, isLoading } = useGetDocuments({
    title: manualSearch,
  });

  const { data: res, mutate, isLoading: isLoadingAIResponse } = useOpenAI();

  const [searchOption, setSearchOption] = useState<SearchOption>(
    SearchOption.DEFAULT,
  );

  const handleAISearch = () => {
    mutate({ prompt: aiSearch });
  };

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
        <LinkButton href={AppRoute.ADD_KNOWLEDGE} className={'ml-auto'}>
          Add knowledge
        </LinkButton>
      </div>

      <div className={'flex w-full grow flex-col gap-4'}>
        <KnowledgeBaseSearch
          isSearching={isLoadingAIResponse}
          register={register}
          setSearchOption={setSearchOption}
          searchOption={searchOption}
          handleAISearch={handleAISearch}
        />
        {searchOption === SearchOption.DEFAULT && (
          <DocumentFeed data={data} isLoading={isLoading} />
        )}
        {searchOption === SearchOption.AI && (
          <>
            <PageHeader
              title={'AI response'}
              description={
                'This is a response from OpenAI based on your uploaded documents.'
              }
            />
            {isLoadingAIResponse && (
              <div className={'flex flex-col items-center'}>
                <Image
                  src={'/assets/robot.gif'}
                  width={600}
                  height={300}
                  alt={'loading'}
                />
                <p className={'font-semibold text-gray-400'}>
                  Please wait while im searching for results ...
                </p>
              </div>
            )}
            {!isLoadingAIResponse && res && <Markdown>{res.response}</Markdown>}
          </>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBase;
