import React, { FC } from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@components/ui/card';

import { RouterOutput } from '@utils/trpc';
import { File } from 'lucide-react';
import Link from 'next/link';
import { AppRoute } from '@constants/app-routes';
import { Skeleton } from '@components/ui/skeleton';

type Document = RouterOutput['knowledgeBase']['findDocuments'][number];

interface Props {
  document: Document;
}

export const DocumentCard: FC<Props> = ({ document }) => {
  return (
    <Link href={AppRoute.KNOWLEDGE.replace(':id', document.id)}>
      <Card
        className={'cursor-pointer duration-300 ease-in-out hover:scale-105'}
      >
        <CardHeader>
          <div className={'flex flex-row gap-2'}>
            <div>
              <File />
            </div>
            <div>
              <CardTitle>{document.title}</CardTitle>
              <CardDescription>{document.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
};

export const DocumentCardSkeleton: FC = () => {
  return (
    <Card>
      <CardHeader>
        <div className={'flex flex-row gap-2'}>
          <Skeleton className="h-[32px] w-[32px] rounded-md" />
          <div className={'flex flex-col gap-2'}>
            <CardTitle>
              <Skeleton className="h-[20px] w-[150px] rounded-full" />
            </CardTitle>
            <Skeleton className="h-[20px] w-[100px] rounded-full" />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export const DocumentCardSkeletonList: FC<{ count?: number }> = ({
  count = 3,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <DocumentCardSkeleton key={i} />
      ))}
    </>
  );
};
