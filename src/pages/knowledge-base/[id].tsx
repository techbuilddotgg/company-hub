import React, { FC } from 'react';
import { useGetDocument } from '@hooks';
import { useRouter } from 'next/router';
import {
  Button,
  DataView,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Markdown,
  PageHeader,
  PageUnavailable,
} from '@components';
import { RouterOutput } from '@utils/trpc';
import { Edit, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { AppRoute } from '@constants/app-routes';
import moment from 'moment';

type DocumentData = RouterOutput['knowledgeBase']['findById'];

const DocumentActions: FC<{ documentId: string }> = ({ documentId }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={'ml-auto w-10 rounded-full p-0'}>
          <MoreVertical className={'h-4 w-4'} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36">
        <DropdownMenuGroup>
          <Link href={AppRoute.EDIT_KNOWLEDGE.replace(':id', documentId)}>
            <DropdownMenuItem className={'cursor-pointer'}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
const DocumentPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading } = useGetDocument(
    {
      id: id as string,
    },
    {
      enabled: !!id,
    },
  );

  return (
    <DataView<DocumentData>
      isLoading={isLoading}
      data={data}
      fallback={<PageUnavailable />}
    >
      {(data) => (
        <div className={'flex flex-col gap-4'}>
          <div className={'flex flex-row items-center'}>
            <PageHeader
              title={data.title}
              description={
                <>
                  <p>{data.description}</p>
                  <p>Author: {data.author.username}</p>
                  <p>
                    {data.createdAt >= data.updatedAt ? 'Created' : 'Updated'}:{' '}
                    {moment(
                      data.createdAt >= data.updatedAt
                        ? data.createdAt
                        : data.updatedAt,
                    )
                      .startOf('seconds')
                      .fromNow()}
                  </p>
                </>
              }
            />
            <DocumentActions documentId={data.id} />
          </div>

          <Markdown>{data.content}</Markdown>
        </div>
      )}
    </DataView>
  );
};
export default DocumentPage;
