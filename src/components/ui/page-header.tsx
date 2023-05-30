import React, { FC, ReactNode } from 'react';
import { cn } from '@utils/classNames';
import { Menu } from 'lucide-react';
import { Button } from '@components/ui/button';
import { useNavigationStore } from '../../store/navigation-store';

interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  className?: string;
  classNameContainer?: string;
  rightHelper?: ReactNode;
}

export const PageHeader: FC<PageHeaderProps> = ({
  title,
  description,
  className,
  rightHelper,
  classNameContainer,
}) => {
  const { isOpened: isNavigationOpened, setIsOpened: setNavigationOpened } =
    useNavigationStore();
  return (
    <div className="flex w-full flex-row items-start pt-6 md:pt-8">
      <Button
        className={`${
          isNavigationOpened ? 'md:-ml-[90px]' : 0
        } transition-[margin]`}
        variant={'outline'}
        onClick={() => setNavigationOpened(true)}
      >
        <Menu className={'h-4 w-4'} />
      </Button>

      <div
        className={cn(
          `ml-4 flex w-full flex-col sm:flex-row md:ml-10`,
          classNameContainer,
        )}
      >
        <div className={cn('flex flex-col gap-1', className)}>
          <h1 className="text-3xl font-bold">{title}</h1>
          <div className="text-sm text-gray-500">{description}</div>
        </div>
        {rightHelper && rightHelper}
      </div>
    </div>
  );
};
