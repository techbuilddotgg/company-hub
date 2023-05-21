import React, { Dispatch, FC, SetStateAction } from 'react';
import { RouterOutput } from '@utils/trpc';
import { PageHeader } from '@components/ui/page-header';
import { DataView } from '@components/ui/data-view';
import { DocumentCard } from '@components/pages/knowledge-base/document-card';
import {
  FilterOption,
  KnowledgeBaseFilterOptions,
} from '@components/pages/knowledge-base/knowledge-base-filter-options';

type DocumentFeedData = RouterOutput['knowledgeBase']['findDocuments'];

export const DocumentFeed: FC<{
  data?: DocumentFeedData;
  isLoading: boolean;
  filterOption: FilterOption;
  setFilterOption: Dispatch<SetStateAction<FilterOption>>;
}> = ({ data, isLoading, filterOption, setFilterOption }) => {
  return (
    <div className={'flex flex-col gap-4'}>
      <div className={'flex flex-row items-center'}>
        <PageHeader
          title={'Documents'}
          description={'Documents that your company uploaded'}
        />
        <div className={'ml-auto'}>
          <KnowledgeBaseFilterOptions
            filterOption={filterOption}
            setFilterOption={setFilterOption}
          />
        </div>
      </div>

      <div className={'grid grid-cols-4 gap-4'}>
        <DataView<DocumentFeedData> isLoading={isLoading} data={data}>
          {(data) =>
            data.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))
          }
        </DataView>
      </div>
    </div>
  );
};
