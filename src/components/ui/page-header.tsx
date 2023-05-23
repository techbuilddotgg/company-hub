import React, { FC, ReactNode } from 'react';
import { cn } from '@utils/classNames';
import { Menu } from 'lucide-react';
import { Button } from '@components/ui/button';
import { useNavigationStore } from '../../store/navigation-store';

interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  className?: string;
  rightHelper?: ReactNode;
}

export const PageHeader: FC<PageHeaderProps> = ({
  title,
  description,
  className,
  rightHelper,
}) => {
  const { isOpened: isNavigationOpened, setIsOpened: setNavigationOpened } =
    useNavigationStore();
  return (
    <div className="flex w-full flex-row items-start pt-6 md:pt-8">
      {!isNavigationOpened && (
        <Button variant={'outline'} onClick={() => setNavigationOpened(true)}>
          <Menu className={'h-4 w-4'} />
        </Button>
      )}
      <div className={`${isNavigationOpened ? 'ml-0' : 'ml-4 md:ml-9'} w-full`}>
        <div className={cn('flex flex-row justify-between gap-1', className)}>
          <h1 className="text-3xl font-bold">{title}</h1>
          {rightHelper && rightHelper}
        </div>
        <div className="text-sm text-gray-500">{description}</div>
      </div>
    </div>
  );
};
