import React, { FC, ReactNode } from 'react';
import { cn } from '@utils/classNames';

interface PageHeaderProps {
  className?: string;
  children: ReactNode | ReactNode[];
}

export const PageHeader: FC<PageHeaderProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'mb-10 ml-[80px] mt-[22px] flex w-full flex-row items-center justify-between gap-1 md:mt-[34px]',
        className,
      )}
    >
      {children}
    </div>
  );
};
