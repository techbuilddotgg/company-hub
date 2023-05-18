import React from 'react';
import { RouterOutput } from '@utils/trpc';
import { PageHeader } from '@components/ui/page-header';
import { DataView } from '@components/ui/data-view';
import { DocumentCard } from '@components/pages/knowledge-base/document-card';
import { useGetDocuments } from '@hooks';

type DocumentFeedData = RouterOutput['knowledgeBase']['findDocuments'];

export const DocumentFeed = () => {
  const { data, isLoading, isError } = useGetDocuments();

  return (
    <div className={'flex flex-col gap-4'}>
      <PageHeader title={'Documents'} />
      <DataView<DocumentFeedData> isLoading={isLoading} data={data}>
        {(data) =>
          data.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))
        }
      </DataView>
    </div>
  );
};
