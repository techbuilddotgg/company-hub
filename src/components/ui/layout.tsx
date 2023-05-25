import React, { FC, PropsWithChildren } from 'react';
import { Navigation } from '@components';
import { useNavigationStore } from '../../store/navigation-store';

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  const isOpened = useNavigationStore((state) => state.isOpened);
  return (
    <div className={'flex h-full flex-col overflow-x-hidden sm:flex-row'}>
      <Navigation />
      <main
        className={`flex-1 overflow-x-auto px-6 transition-[margin] md:px-10 ${
          isOpened ? 'md:ml-[300px]' : 'md:ml-0'
        }`}
      >
        {children}
      </main>
    </div>
  );
};
