import React, { FC, PropsWithChildren } from 'react';
import { Navigation } from '@components';

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={'flex h-full flex-col overflow-x-hidden sm:flex-row'}>
      <Navigation />
      <main className={'flex-1 overflow-x-auto px-6 md:px-10'}>{children}</main>
    </div>
  );
};
