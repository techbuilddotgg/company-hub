import React from 'react';
import {
  PageHeader,
  KnowledgeBaseSearch,
  LinkButton,
  DocumentFeed,
  Button,
} from '@components';
import { AppRoute } from '@constants/app-routes';
import { useForm } from 'react-hook-form';
import { useDebounce, useGetDocuments, useOpenAI } from '@hooks';

const KnowledgeBase = () => {
  const { register, watch } = useForm<{ search: string }>({
    defaultValues: {
      search: '',
    },
  });

  const search = useDebounce(watch('search'));

  const { data, isLoading } = useGetDocuments({
    title: search,
  });

  const { data: res, mutate } = useOpenAI();

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
        <KnowledgeBaseSearch register={register} />
        <div className={'grid grid-cols-4 gap-4'}>
          <DocumentFeed data={data} isLoading={isLoading} />
        </div>
        <>
          <Button onClick={() => mutate({ prompt: 'Who is Domen Perko' })}>
            OpenAI
          </Button>
          {res && <p>{JSON.stringify(res)}</p>}
        </>
      </div>
    </div>
  );
};

export default KnowledgeBase;
