import React, { FC } from 'react';
import { RouterOutput } from '@utils/trpc';
import { PageHeader } from '@components/ui/page-header';
import { DataView } from '@components/ui/data-view';
import { DocumentCard } from '@components/pages/knowledge-base/document-card';

type DocumentFeedData = RouterOutput['knowledgeBase']['findDocuments'];

export const DocumentFeed: FC<{
  data?: DocumentFeedData;
  isLoading: boolean;
}> = ({ data, isLoading }) => {
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
