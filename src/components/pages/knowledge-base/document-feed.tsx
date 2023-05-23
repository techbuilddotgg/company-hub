import React, { Dispatch, FC, SetStateAction } from 'react';
import { RouterOutput } from '@utils/trpc';
import { DataView } from '@components/ui/data-view';
import { DocumentCard } from '@components/pages/knowledge-base/document-card';
import {
  FilterOption,
  KnowledgeBaseFilterOptions,
} from '@components/pages/knowledge-base/knowledge-base-filter-options';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import dynamic from 'next/dynamic';
import PageSubheader from '@components/ui/page-subheader';

const DocumentCardSkeletonList = dynamic(
  () =>
    import('@components/pages/knowledge-base/document-card').then(
      (mod) => mod.DocumentCardSkeletonList,
    ),
  {
    ssr: false,
  },
);

type DocumentFeedData = RouterOutput['knowledgeBase']['findDocuments'];

export const DocumentFeed: FC<{
  data?: DocumentFeedData;
  isLoading: boolean;
  filterOption: FilterOption;
  setFilterOption: Dispatch<SetStateAction<FilterOption>>;
}> = ({ data, isLoading, filterOption, setFilterOption }) => {
  const [parent] = useAutoAnimate();

  return (
    <div className={'flex flex-col gap-4'}>
      <div className={'mt-6 flex flex-row items-center'}>
        <PageSubheader
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

      <div
        className={
          'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        }
        ref={parent}
      >
        <DataView<DocumentFeedData>
          isLoading={isLoading}
          loadingComponent={<DocumentCardSkeletonList />}
          data={data}
        >
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
