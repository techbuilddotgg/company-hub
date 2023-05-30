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
import { Bot, FileSearch } from 'lucide-react';

const KnowledgeBase = () => {
  const { register, watch } = useForm<{
    search: string;
  }>({
    defaultValues: {
      search: '',
    },
  });

  const search = useDebounce(watch('search'));

  const { data: res, mutate, isLoading: isLoadingAIResponse } = useOpenAI();

  const [searchOption, setSearchOption] = useState<SearchOption>(
    SearchOption.DEFAULT,
  );

  const [filterOption, setFilterOption] = useState<FilterOption>(
    FilterOption.CREATED_AT_DESC,
  );

  const { data, isLoading } = useGetDocuments({
    title: search,
    order: filterOption.toLowerCase(),
  });
  const handleAISearch = () => {
    mutate({ prompt: search });
  };

  const [parent] = useAutoAnimate();

  return (
    <div className={'flex h-full flex-col gap-2'}>
      <div className={'flex flex-row items-center'}>
        <PageHeader
          title={'Knowledge Base'}
          description={
            'Centralized repository of organized information and data.'
          }
          rightHelper={
            <LinkButton
              href={AppRoute.ADD_KNOWLEDGE}
              className={'ml-auto self-end'}
            >
              Add knowledge
            </LinkButton>
          }
        />
      </div>

      <div className={'flex w-full grow flex-col gap-1'}>
        {searchOption === SearchOption.DEFAULT && (
          <div className={'mt-4 flex items-center gap-1 text-sm'}>
            <FileSearch className={'h-4 w-4'} />
            Manual search
          </div>
        )}
        {searchOption === SearchOption.AI && (
          <div className={'mt-4 flex items-center gap-1 text-sm'}>
            <Bot className={'h-4 w-4'} />
            AI search
          </div>
        )}
        <KnowledgeBaseSearch
          isSearching={isLoadingAIResponse}
          register={register}
          setSearchOption={setSearchOption}
          searchOption={searchOption}
          handleAISearch={handleAISearch}
        />
        <div className={'mt-10'} ref={parent}>
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
    </div>
  );
};

export default KnowledgeBase;
