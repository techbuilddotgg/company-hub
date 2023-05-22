import React, { FC, ReactNode } from 'react';
import { cn } from '@utils/classNames';

interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  className?: string;
}

export const PageHeader: FC<PageHeaderProps> = ({
  title,
  description,
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <h1 className={'text-2xl font-semibold text-gray-800 dark:text-gray-100'}>
        {title}
      </h1>
      <div className={'text-sm text-gray-500'}>{description}</div>
    </div>
  );
};
