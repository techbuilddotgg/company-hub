import React, { FC } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@components/ui/card';

import Image from 'next/image';
import { RouterOutput } from '@utils/trpc';

type Document = RouterOutput['knowledgeBase']['findDocuments'][number];

interface Props {
  document: Document;
}

export const DocumentCard: FC<Props> = ({ document }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{document.title}</CardTitle>
        <CardDescription>{document.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={'flex flex-row gap-2'}>
          <Image
            src={document.author.profileImageUrl}
            width={32}
            height={32}
            className={'rounded-full'}
          />
          {document.author.username}
        </div>
      </CardContent>
    </Card>
  );
};
