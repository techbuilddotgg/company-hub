import React, { useState } from 'react';
import {
  AiResponse,
  DocumentFeed,
  KnowledgeBaseSearch,
  LinkButton,
  PageHeader,
  SearchOption,
} from '@components';
import { AppRoute } from '@constants/app-routes';
import { useForm } from 'react-hook-form';
import { useDebounce, useGetDocuments, useOpenAI } from '@hooks';
import { FilterOption } from '@components/pages/knowledge-base/knowledge-base-filter-options';
import { useAutoAnimate } from '@formkit/auto-animate/react';

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

  const { data: res, mutate, isLoading: isLoadingAIResponse } = useOpenAI();

  const [searchOption, setSearchOption] = useState<SearchOption>(
    SearchOption.DEFAULT,
  );

  const [filterOption, setFilterOption] = useState<FilterOption>(
    FilterOption.CREATED_AT_DESC,
  );

  const { data, isLoading } = useGetDocuments({
    title: manualSearch,
    order: filterOption.toLowerCase(),
  });
  const handleAISearch = () => {
    mutate({ prompt: aiSearch });
  };

  const [parent] = useAutoAnimate();

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

      <div className={'flex w-full grow flex-col gap-4'} ref={parent}>
        <KnowledgeBaseSearch
          isSearching={isLoadingAIResponse}
          register={register}
          setSearchOption={setSearchOption}
          searchOption={searchOption}
          handleAISearch={handleAISearch}
        />
        {searchOption === SearchOption.DEFAULT && (
          <DocumentFeed
            setFilterOption={setFilterOption}
            filterOption={filterOption}
            data={data}
            isLoading={isLoading}
          />
        )}
        {searchOption === SearchOption.AI && (
          <AiResponse isLoading={isLoadingAIResponse} data={res} />
        )}
      </div>
    </div>
  );
};

export default KnowledgeBase;
