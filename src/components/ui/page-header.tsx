import React, { FC } from 'react';

interface PageHeaderProps {
  title: string;
  className?: string;
}

export const PageHeader: FC<PageHeaderProps> = ({ title, className }) => {
  return (
    <div className={className}>
      <h1 className={'text-2xl font-semibold text-gray-800 dark:text-gray-100'}>
        {title}
      </h1>
    </div>
  );
};
