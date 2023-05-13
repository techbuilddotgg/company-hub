import React, { FC } from 'react';
import { cn } from '@utils/classNames';

interface PageHeaderProps {
  title: string;
  description?: string;
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
      <p className={'text-sm text-gray-500'}>{description}</p>
    </div>
  );
};
