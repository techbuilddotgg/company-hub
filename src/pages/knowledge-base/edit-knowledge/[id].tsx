import React from 'react';
import {
  AlertDialogButton,
  Card,
  CardContent,
  CardHeader,
  DataView,
  KnowledgeForm,
  KnowledgeFormType,
  PageHeader,
} from '@components';
import { useGetDocument } from '@hooks';
import { useRouter } from 'next/router';
import { RouterOutput } from '@utils/trpc';
import { X } from 'lucide-react';

type KnowledgeDocument = RouterOutput['knowledgeBase']['findById'];
const EditKnowledgePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, refetch, isLoading } = useGetDocument(
    {
      id: id as string,
    },
    {
      enabled: !!id,
    },
  );

  return (
    <div className={'flex flex-col gap-4'}>
      <DataView<KnowledgeDocument> isLoading={isLoading} data={data}>
        {(data) => {
          return (
            <>
              <PageHeader
                title={'Edit Knowledge'}
                description={
                  <>
                    Edit the knowledge document for{' '}
                    <span className={'font-semibold text-blue-600'}>
                      {data.title}
                    </span>
                  </>
                }
              />
              <div className={'flex w-full flex-row justify-center'}>
                <Card className="w-2/3">
                  <CardHeader className={'p-0'}>
                    <div className={'ml-auto'}>
                      <AlertDialogButton
                        buttonVariant={'ghost'}
                        buttonClassName={'rounded-full p-0 w-10'}
                        buttonText={<X className={'h-6 w-6 cursor-pointer'} />}
                        title={'Delete document'}
                        description={
                          'Are you sure you want to delete this document?'
                        }
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <KnowledgeForm
                      id={id as string}
                      type={KnowledgeFormType.EDIT}
                      initialValues={data}
                      refetch={refetch}
                    />
                  </CardContent>
                </Card>
              </div>
            </>
          );
        }}
      </DataView>
    </div>
  );
};

export default EditKnowledgePage;
