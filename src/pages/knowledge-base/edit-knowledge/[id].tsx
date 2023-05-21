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
import { useDeleteDocument, useGetDocument } from '@hooks';
import { useRouter } from 'next/router';
import { RouterOutput, trpc } from '@utils/trpc';
import { X } from 'lucide-react';
import { AppRoute } from '@constants/app-routes';

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

  const utils = trpc.useContext();
  const { mutateAsync } = useDeleteDocument({
    onSuccess: () => {
      utils.knowledgeBase.findDocuments.invalidate();
    },
  });

  const handleDelete = async () => {
    await mutateAsync({ id: id as string });
    await router.push(AppRoute.KNOWLEDGE_BASE);
  };

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
                        handleAction={handleDelete}
                        buttonVariant={'ghost'}
                        buttonClassName={'rounded-full p-0 w-10'}
                        buttonText={<X className={'h-6 w-6 cursor-pointer'} />}
                        actionText={'Delete'}
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
