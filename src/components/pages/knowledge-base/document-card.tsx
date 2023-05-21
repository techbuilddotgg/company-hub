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

type Document = RouterOutput['knowledgeBase']['findDocuments'][number];

interface Props {
  document: Document;
}

export const DocumentCard: FC<Props> = ({ document }) => {
  return (
    <Link href={AppRoute.KNOWLEDGE.replace(':id', document.id)}>
      <Card className={'cursor-pointer'}>
        <CardHeader>
          <div className={'flex flex-row gap-2'}>
            <File />
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
